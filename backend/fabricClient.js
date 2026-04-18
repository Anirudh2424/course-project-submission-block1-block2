const axios = require('axios');

// Kaleido REST API Gateway URL (FabConnect)
const KALEIDO_REST_URL = "https://k0n2lhndvu:OWWkPN5XqhLF19A73oOm1WADm8zjpTC1MpGcP6F-Eww@k0f605r1mv-k0c1p2yb9a-connect.kr0-aws-ws.kaleido.io";

async function getGateway(orgName, userId) {
    // Identity mapping: Use the default Kaleido identity
    const signer = "user1"; 
    const channel = "default-channel";
    const chaincode = "tendercc";

    // Build an API wrapper that mimics the Fabric Gateway Contract interface
    const contractMock = {
        evaluateTransaction: async (action, ...args) => {
             const payload = {
                 headers: { signer, channel, chaincode }, // type: 'Query' not needed for /query endpoint
                 func: action,
                 args: args
             };
             
             try {
                const response = await axios.post(`${KALEIDO_REST_URL}/query`, payload);
                // FabConnect returns result in 'result' property
                return Buffer.from(JSON.stringify(response.data.result || response.data));
             } catch(err) {
                 console.error("Kaleido REST Query Error:", err.response?.data || err.message);
                 throw err;
             }
        },
        submitTransaction: async (action, ...args) => {
             const payload = {
                 headers: { type: "SendTransaction", signer, channel, chaincode },
                 func: action,
                 args: args,
                 sync: true
             };
             try {
                const response = await axios.post(`${KALEIDO_REST_URL}/transactions`, payload);
                return Buffer.from(JSON.stringify(response.data.result || response.data));
             } catch(err) {
                 console.error("Kaleido REST Submit Error:", err.response?.data || err.message);
                 throw err;
             }
        },
        submit: async (action, options) => {
             const payload = {
                 headers: { type: "SendTransaction", signer, channel, chaincode },
                 func: action,
                 args: options.arguments,
                 transient: {},
                 sync: true
             };
             
             if (options.transientData) {
                 for (const [key, value] of Object.entries(options.transientData)) {
                     // FabConnect expects Base64 encoded transient data
                     payload.transient[key] = value.toString('base64');
                 }
             }
             
             try {
                const response = await axios.post(`${KALEIDO_REST_URL}/transactions`, payload);
                return Buffer.from(JSON.stringify(response.data.result || response.data));
             } catch(err) {
                 console.error("Kaleido REST Submit Transient Error:", err.response?.data || err.message);
                 throw err;
             }
        }
    };

    // Return the mocked objects so server.js doesn't need to change at all!
    return { 
        gateway: { close: () => {} }, 
        client: { close: () => {} }, 
        contract: contractMock 
    };
}

module.exports = { getGateway };
