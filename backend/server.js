const express = require('express');
const cors = require('cors');
const { getGateway } = require('./fabricClient');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-tendering-key';
const usersFile = path.join(__dirname, 'users.json');

function getUsers() {
    if (!fs.existsSync(usersFile)) return [];
    try { return JSON.parse(fs.readFileSync(usersFile, 'utf8')); } catch(e) { return []; }
}
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Security Middleware: Enforce Credentials using JWT
const requireIdentity = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { userId, role, orgName }
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

// Auth Endpoints
app.post('/auth/signup', async (req, res) => {
    const { userId, password, role, walletId } = req.body;
    if (!userId || !password || !role) return res.status(400).json({ error: "Missing required fields" });
    
    const users = getUsers();
    if (users.find(u => u.userId === userId)) {
        return res.status(409).json({ error: "User already exists" });
    }
    
    // Map roles to Fabric orgs
    let orgName = 'Org1'; // Default Issuer/Gov/Auditor
    if (role === 'bidder') orgName = 'Org2'; // Contractor

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { userId, password: hashedPassword, role, walletId, orgName };
    users.push(newUser);
    saveUsers(users);
    
    console.log(`[Auth] Registered new user: ${userId} (${role})`);
    res.status(201).json({ success: true, message: "User created" });
});

app.post('/auth/login', async (req, res) => {
    const { userId, password, requestedRole } = req.body;
    const users = getUsers();
    const user = users.find(u => u.userId === userId);
    
    if (!user) return res.status(404).json({ error: "User not found" });
    
    if (requestedRole && user.role !== requestedRole) {
        return res.status(403).json({ error: `Account mismatch. You registered as '${user.role}' but tried to sign in as '${requestedRole}'.` });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid password" });
    
    const token = jwt.sign({ userId: user.userId, role: user.role, orgName: user.orgName }, JWT_SECRET, { expiresIn: '8h' });
    console.log(`[Auth] User logged in: ${userId}`);
    res.json({ success: true, token, role: user.role, userId: user.userId, orgName: user.orgName });
});

async function executeTransaction(req, res, orgName, userId, action, args, isQuery = false, transientData = null) {
    let gateway, client;
    try {
        const connection = await getGateway(orgName, userId);
        gateway = connection.gateway;
        client = connection.client;
        const contract = connection.contract;

        let resultBytes;
        if (isQuery) {
            resultBytes = await contract.evaluateTransaction(action, ...args);
        } else if (transientData) {
             resultBytes = await contract.submit(action, {
                 arguments: args,
                 transientData: transientData
             });
        } else {
            resultBytes = await contract.submitTransaction(action, ...args);
        }

        const resultStr = Buffer.from(resultBytes).toString('utf8');
        try {
            res.status(200).json(JSON.parse(resultStr));
        } catch(e) {
            res.status(200).send(resultStr);
        }
    } catch (error) {
        console.error(`[Fabric Error] ${action}:`, error);
        
        let status = 500;
        if(error.message.includes('Unauthorized')) status = 403;
        else if(error.message.includes('deadline')) status = 400;
        else if(error.message.includes('exist')) status = 404;

        res.status(status).json({ error: error.details?.[0]?.message || error.message || "Internal Bridge Error" });
    } finally {
        if (gateway) gateway.close();
        if (client) client.close();
    }
}

app.post('/tender/create', requireIdentity, async (req, res) => {
    const { tenderId, title, budget, deadline, createdBy } = req.body;
    const { orgName, userId } = req.user;
    await executeTransaction(req, res, orgName, userId, 'createTender', [tenderId, title, budget.toString(), deadline.toString(), createdBy]);
});

app.get('/tender/all', requireIdentity, async (req, res) => {
    const { orgName, userId } = req.user;
    await executeTransaction(req, res, orgName, userId, 'getAllTenders', [], true);
});

app.get('/tender/:id', requireIdentity, async (req, res) => {
    const { orgName, userId } = req.user;
    try {
        const tenderId = req.params.id;
        await executeTransaction(req, res, orgName, userId, 'getContractDetails', [tenderId], true);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Failed to fetch tender details' });
    }
});

app.post('/bid/submit', requireIdentity, async (req, res) => {
    const { tenderId, contractorId, bidAmount, salt } = req.body;
    const { orgName, userId, role } = req.user;
    
    if (role !== 'bidder') {
        return res.status(403).json({ error: 'Unauthorized: Only contractors (bidders) can submit bids.' });
    }

    try {
        const hash = crypto.createHash('sha256').update(bidAmount.toString() + salt.toString()).digest('hex');
        await executeTransaction(req, res, orgName, userId, 'submitBid', [tenderId, contractorId, bidAmount.toString(), hash], false, null);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Failed to submit bid to ledger.' });
    }
});

app.post('/bid/reveal', requireIdentity, async (req, res) => {
    const { tenderId, contractorId, bidAmount, salt } = req.body;
    const { orgName, userId } = req.user;
    await executeTransaction(req, res, orgName, userId, 'revealBid', [tenderId, contractorId, bidAmount.toString(), salt.toString()]);
});

app.post('/tender/evaluate', requireIdentity, async (req, res) => {
    const { tenderId } = req.body;
    const { orgName, userId } = req.user;
    await executeTransaction(req, res, orgName, userId, 'evaluateBids', [tenderId]);
});

app.post('/tender/award', requireIdentity, async (req, res) => {
    const { tenderId, contractorId } = req.body;
    const { orgName, userId } = req.user;
    await executeTransaction(req, res, orgName, userId, 'awardContract', [tenderId, contractorId]);
});

app.post('/tender/orchestrate-award', requireIdentity, async (req, res) => {
    const { tenderId } = req.body;
    const { orgName, userId } = req.user;
    let gateway, client;
    try {
        const connection = await getGateway(orgName, userId);
        gateway = connection.gateway;
        client = connection.client;
        const contract = connection.contract;

        // 1. Evaluate Bids
        const evalBytes = await contract.evaluateTransaction('evaluateBids', tenderId);
        const evaluation = JSON.parse(Buffer.from(evalBytes).toString('utf8'));
        
        // 2. Award Contract
        const awardBytes = await contract.submitTransaction('awardContract', tenderId, evaluation.recommendedContractor);
        const awardedTender = JSON.parse(Buffer.from(awardBytes).toString('utf8'));

        // 3. Auto-calculate and create 3 Standard Milestones
        const totalBudget = parseFloat(awardedTender.budget || evaluation.amount || 0);
        const splitAmount = (totalBudget / 3).toFixed(2);
        
        await contract.submitTransaction('createMilestone', tenderId, `${tenderId}-M1`, 'Phase 1: Setup & Planning', splitAmount.toString());
        await contract.submitTransaction('createMilestone', tenderId, `${tenderId}-M2`, 'Phase 2: Core Implementation', splitAmount.toString());
        await contract.submitTransaction('createMilestone', tenderId, `${tenderId}-M3`, 'Phase 3: Final Delivery', splitAmount.toString());

        res.status(200).json({ success: true, message: "Contract automatically awarded and milestones created.", tender: awardedTender });
    } catch (error) {
        console.error('[Orchestration Error]:', error);
        res.status(500).json({ error: error.details?.[0]?.message || error.message || "Orchestration failed" });
    } finally {
        if (gateway) gateway.close();
        if (client) client.close();
    }
});

app.post('/milestone/verify', requireIdentity, async (req, res) => {
    const { milestoneId, status } = req.body;
    const { orgName, userId, role } = req.user;
    if (role !== 'auditor') return res.status(403).json({ error: 'Only auditors can verify' });
    // Use the authenticated block's userId as the auditorId
    await executeTransaction(req, res, orgName, userId, 'verifyMilestone', [milestoneId, userId, status]);
});

app.post('/milestone/pay', requireIdentity, async (req, res) => {
    const { tenderId, milestoneId } = req.body;
    const { orgName, userId, role } = req.user;
    if (role !== 'issuer') return res.status(403).json({ error: 'Only issuers can release payment' });
    await executeTransaction(req, res, orgName, userId, 'releasePayment', [tenderId, milestoneId]);
});

app.post('/milestone/create', requireIdentity, async (req, res) => {
    const { tenderId, milestoneId, description, amount } = req.body;
    const { orgName, userId } = req.user;
    await executeTransaction(req, res, orgName, userId, 'createMilestone', [tenderId, milestoneId, description, amount.toString()]);
});

app.listen(PORT, () => {
    console.log(`Enterprise Gateway active on http://localhost:${PORT}`);
});
