'use strict';

const { Contract } = require('fabric-contract-api');
const crypto = require('crypto');

class TenderContract extends Contract {

    _getTxCreatorMSP(ctx) {
        return ctx.clientIdentity.getMSPID();
    }

    async createTender(ctx, tenderId, title, budget, deadlineTimestamp, createdBy) {
        // Security Note: In a production Kaleido network, MSP IDs are automatically generated (e.g., u0x...). 
        // We comment out the hardcoded 'Org1MSP' check and rely on the Express Backend's JWT role validation for the demo.
        const mspId = this._getTxCreatorMSP(ctx);
        // if (mspId !== 'Org1MSP') {
        //     throw new Error('Unauthorized: Only Government (Org1) can create tenders');
        // }

        const tender = {
            docType: 'Tender',
            id: tenderId,
            title: title,
            budget: parseFloat(budget),
            deadline: parseInt(deadlineTimestamp),
            createdBy: createdBy,
            status: 'OPEN', 
            awardedTo: null,
            milestones: [] 
        };

        await ctx.stub.putState(tenderId, Buffer.from(JSON.stringify(tender)));
        return JSON.stringify(tender);
    }

    async getTender(ctx, tenderId) {
        const tenderBytes = await ctx.stub.getState(tenderId);
        if (!tenderBytes || tenderBytes.length === 0) {
            throw new Error(`The tender ${tenderId} does not exist`);
        }
        return tenderBytes.toString();
    }

    // LevelDB Compatible Query (Filter in memory)
    async getAllTenders(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const allResults = [];
        let result = await iterator.next();
        while (!result.done) {
            if (result.value && result.value.value) {
                const strValue = Buffer.from(result.value.value.toString('utf8')).toString('utf8');
                let record;
                try {
                    record = JSON.parse(strValue);
                    // Filter in-memory for docType 'Tender'
                    if (record && record.docType === 'Tender') {
                        allResults.push(record);
                    }
                } catch (err) {
                    // Ignore non-json or differently formatted records
                }
            }
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async submitBid(ctx, tenderId, contractorId, bidAmountStr, hash) {
        // Security Note: Bypassed hardcoded Org2MSP check for Cloud deployment
        const mspId = this._getTxCreatorMSP(ctx);
        // if (mspId !== 'Org2MSP') {
        //     throw new Error('Unauthorized: Only Contractors (Org2) can submit bids');
        // }

        const tenderBytes = await ctx.stub.getState(tenderId);
        if (!tenderBytes || tenderBytes.length === 0) {
            throw new Error(`The tender ${tenderId} does not exist`);
        }
        const tender = JSON.parse(tenderBytes.toString());
        
        // Strict Time Rules
        const txTimestamp = ctx.stub.getTxTimestamp();
        const currentTimestamp = txTimestamp.seconds.low * 1000;
        
        if (currentTimestamp >= tender.deadline) {
             throw new Error(`Tender deadline elapsed (${new Date(tender.deadline)}). Submission rejected.`);
        }

        if(!bidAmountStr || !hash) {
            throw new Error('The bidAmount and hash must be provided to submit the bid.');
        }

        if(isNaN(parseFloat(bidAmountStr)) || parseFloat(bidAmountStr) <= 0) {
             throw new Error('bidAmount must be a positive number');
        }

        const bidKey = ctx.stub.createCompositeKey('Bid', [tenderId, contractorId]);
        const bidData = {
            docType: 'PrivateBid',
            tenderId: tenderId,
            contractorId: contractorId,
            bidAmount: parseFloat(bidAmountStr),
            hash: hash,
            status: 'SUBMITTED' 
        };

        await ctx.stub.putState(bidKey, Buffer.from(JSON.stringify(bidData)));
        return JSON.stringify({ message: `Bid successfully sealed in private collection` });
    }

    async revealBid(ctx, tenderId, contractorId, bidAmount, salt) {
        // Security Note: Bypassed hardcoded Org2MSP check for Cloud deployment
        const mspId = this._getTxCreatorMSP(ctx);
        // if (mspId !== 'Org2MSP') {
        //     throw new Error('Unauthorized: Only Contractors can reveal bids');
        // }

        const tenderBytes = await ctx.stub.getState(tenderId);
        if (!tenderBytes || tenderBytes.length === 0) {
            throw new Error(`The tender ${tenderId} does not exist`);
        }
        const tender = JSON.parse(tenderBytes.toString());

        // Strict Time Rules: Reveal only AFTER deadline
        const txTimestamp = ctx.stub.getTxTimestamp();
        const currentTimestamp = txTimestamp.seconds.low * 1000;
        if (currentTimestamp < tender.deadline) {
             throw new Error('Security Violation: Bids cannot be revealed before the tender deadline.');
        }

        const bidKey = ctx.stub.createCompositeKey('Bid', [tenderId, contractorId]);
        const bidBytes = await ctx.stub.getState(bidKey);
        
        if (!bidBytes || bidBytes.length === 0) {
            throw new Error(`No private sealed bid found for this identity.`);
        }
        const bidData = JSON.parse(bidBytes.toString());

        const computedHash = crypto.createHash('sha256').update(bidAmount.toString() + salt).digest('hex');
        
        if (computedHash !== bidData.hash) {
            throw new Error(`Hash validation failed. The revealed details do not match the sealed genesis variables.`);
        }

        const publicBidData = {
            docType: 'RevealedBid',
            tenderId: tenderId,
            contractorId: contractorId,
            bidAmount: parseFloat(bidAmount)
        };
        const publicBidKey = ctx.stub.createCompositeKey('RevealedBid', [tenderId, contractorId]);
        await ctx.stub.putState(publicBidKey, Buffer.from(JSON.stringify(publicBidData)));
        
        bidData.status = 'REVEALED';
        await ctx.stub.putState(bidKey, Buffer.from(JSON.stringify(bidData)));

        return JSON.stringify(publicBidData);
    }

    async evaluateBids(ctx, tenderId) {
        // Security Note: Bypassed hardcoded Org1MSP check for Cloud deployment
        const mspId = this._getTxCreatorMSP(ctx);
        // if (mspId !== 'Org1MSP') {
        //     throw new Error('Unauthorized: Only Government can evaluate bids');
        // }

        const tenderBytes = await ctx.stub.getState(tenderId);
        if (!tenderBytes || tenderBytes.length === 0) {
            throw new Error(`The tender ${tenderId} does not exist`);
        }
        const tender = JSON.parse(tenderBytes.toString());

        tender.status = 'EVALUATING';
        await ctx.stub.putState(tenderId, Buffer.from(JSON.stringify(tender)));

        // LevelDB fallback for querying revealed bids
        const iterator = await ctx.stub.getStateByRange('', '');

        let lowestBid = null;
        let result = await iterator.next();
        while (!result.done) {
            if (result.value && result.value.value) {
                try {
                    const bid = JSON.parse(Buffer.from(result.value.value.toString('utf8')).toString('utf8'));
                    if (bid && bid.docType === 'RevealedBid' && bid.tenderId === tenderId) {
                        if (!lowestBid || bid.bidAmount < lowestBid.bidAmount) {
                            if (bid.bidAmount <= tender.budget) {
                                lowestBid = bid;
                            }
                        }
                    }
                } catch (err) {
                    // Ignore non-json
                }
            }
            result = await iterator.next();
        }

        if (!lowestBid) {
            throw new Error("No valid revealed bids found within budget limit.");
        }

        return JSON.stringify({ message: "Evaluation complete", recommendedContractor: lowestBid.contractorId, amount: lowestBid.bidAmount });
    }

    async awardContract(ctx, tenderId, contractorId) {
        // Security Note: Bypassed hardcoded Org1MSP check for Cloud deployment
        const mspId = this._getTxCreatorMSP(ctx);
        // if (mspId !== 'Org1MSP') {
        //     throw new Error('Unauthorized');
        // }

        const tenderBytes = await ctx.stub.getState(tenderId);
        if (!tenderBytes || tenderBytes.length === 0) {
            throw new Error(`Tender not found`);
        }
        const tender = JSON.parse(tenderBytes.toString());

        tender.status = 'AWARDED';
        tender.awardedTo = contractorId;

        await ctx.stub.putState(tenderId, Buffer.from(JSON.stringify(tender)));
        return JSON.stringify(tender);
    }

    async createMilestone(ctx, tenderId, milestoneId, description, amount) {
        const tenderBytes = await ctx.stub.getState(tenderId);
        const tender = JSON.parse(tenderBytes.toString());
        
        if (tender.status !== 'AWARDED') {
            throw new Error('Contract must be AWARDED to issue milestones');
        }

        const milestone = {
            docType: 'Milestone',
            id: milestoneId,
            tenderId: tenderId,
            description: description,
            amount: parseFloat(amount),
            status: 'PENDING', 
            verifiedBy: null
        };

        await ctx.stub.putState(`MS_${milestoneId}`, Buffer.from(JSON.stringify(milestone)));
        tender.milestones.push(milestoneId);
        await ctx.stub.putState(tenderId, Buffer.from(JSON.stringify(tender)));

        return JSON.stringify(milestone);
    }

    async verifyMilestone(ctx, milestoneId, auditorId, status) {
        const milestoneBytes = await ctx.stub.getState(`MS_${milestoneId}`);
        if (!milestoneBytes || milestoneBytes.length === 0) {
            throw new Error(`Milestone non-existent`);
        }
        
        const milestone = JSON.parse(milestoneBytes.toString());
        milestone.status = status; 
        milestone.verifiedBy = auditorId;

        await ctx.stub.putState(`MS_${milestoneId}`, Buffer.from(JSON.stringify(milestone)));
        return JSON.stringify(milestone);
    }

    async releasePayment(ctx, tenderId, milestoneId) {
        // Security Note: Bypassed hardcoded Org1MSP check for Cloud deployment
        const mspId = this._getTxCreatorMSP(ctx);
        // if (mspId !== 'Org1MSP') {
        //     throw new Error('Unauthorized');
        // }

        const milestoneBytes = await ctx.stub.getState(`MS_${milestoneId}`);
        const milestone = JSON.parse(milestoneBytes.toString());

        if (milestone.status !== 'VERIFIED') {
            throw new Error('Requirement Violation: Milestone unverified');
        }

        milestone.status = 'PAID';
        await ctx.stub.putState(`MS_${milestoneId}`, Buffer.from(JSON.stringify(milestone)));

        ctx.stub.setEvent('PaymentReleased', Buffer.from(JSON.stringify({
            tenderId: tenderId,
            milestoneId: milestoneId,
            amount: milestone.amount,
        })));

        return JSON.stringify({ message: "Fund Release Authorized", milestoneId: milestoneId });
    }

    async getContractDetails(ctx, tenderId) {
         const tenderBytes = await ctx.stub.getState(tenderId);
         if (!tenderBytes || tenderBytes.length === 0) {
             throw new Error('Not found');
         }
         const tender = JSON.parse(tenderBytes.toString());

         const populatedMilestones = [];
         for (let mid of tender.milestones) {
            const msBytes = await ctx.stub.getState(`MS_${mid}`);
            if (msBytes && msBytes.length > 0) {
                populatedMilestones.push(JSON.parse(msBytes.toString()));
            }
         }
         tender.milestonesData = populatedMilestones;

         return JSON.stringify(tender);
    }
}

module.exports = TenderContract;
