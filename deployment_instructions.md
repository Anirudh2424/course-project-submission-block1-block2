# Deployment Guide

This guide describes how to run and test the complete Decentralized E-Tendering application locally in a development environment.

## Prerequisites
- Node.js >= 18
- Docker and Docker Compose (Ensure Docker engine is running)
- Git (Bash if on Windows)
- JQ, cURL

## 1. Setup Hyperledger Fabric Test Network

Navigate to a folder alongside where you placed your `Decentralized e-Tendering UI` project and fetch the Fabric Samples:

```bash
# This will download the latest hyperledger binaries and docker images natively (Warning: large download)
curl -vsS https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh | bash

# Enter the generated test-network folder
cd fabric-samples/test-network
```

## 2. Start the Network

Spin up the network with Certificate Authorities (CA), enabling 2 Organizations (`Org1` for Government, `Org2` for Contractors) and creating the `tenderchannel`.

```bash
./network.sh up createChannel -c tenderchannel -ca
```

## 3. Deploy the Chaincode

Deploy the custom chaincode implemented in node.js. We provide a collections configuration file to enable **Private Data** functionality (hiding bids initially). *Note: Ensure your path to the `chaincode` folder is correct below relative to your environment!*

```bash
# Since we are using Private Data Collections, we need to pass the Policy and Collections configs.
./network.sh deployCC \
    -ccn tendercc \
    -ccp "../../Decentralized e-Tendering UI/chaincode/tendercc" \
    -ccl javascript \
    -ccep "OR('Org1MSP.member','Org2MSP.member')" \
    -cccg "../../Decentralized e-Tendering UI/chaincode/tendercc/collections_config.json"
```

## 4. Run the Express Backend

In a NEW terminal window, navigate into the backend folder we created and start the node service.

```bash
cd "C:/Users/hrtri/Downloads/Decentralized e-Tendering UI/backend"
npm install
npm start
```
The console will read: `Backend Gateway running on http://localhost:5000`

## 5. Run the React Frontend

In another NEW terminal window, navigate to your root project and launch Vite.

```bash
cd "C:/Users/hrtri/Downloads/Decentralized e-Tendering UI"
npm install
npm run dev
```

The application is now fully accessible at `http://localhost:3000`.

## 6. End-to-End Testing Flow

Here is how you can test the system step-by-step through standard HTTP requests (or you can integrate these directly via buttons using the new `src/api.ts`):

1. **Government creates a Tender** (`Org1`)
   ```json
   POST http://localhost:5000/tender/create
   {"tenderId":"T1001", "title":"Highway Repair", "budget": 1000000, "deadline": 1893456000000, "createdBy": "Govt_Dept"}
   ```

2. **Contractor Submits a Sealed Bid** (`Org2`)
   The amount (500,000) and salt ("my_secret") are temporarily hidden as private data.
   ```json
   POST http://localhost:5000/bid/submit
   {"tenderId":"T1001", "contractorId":"Contractor_A", "bidAmount": 500000, "salt": "my_secret"}
   ```

3. **Contractor Reveals their Bid** (`Org2`)
   Occurs after the deadline. Automatically validates the hash.
   ```json
   POST http://localhost:5000/bid/reveal
   {"tenderId":"T1001", "contractorId":"Contractor_A", "bidAmount": 500000, "salt": "my_secret"}
   ```

4. **Government Evaluates Bids** (`Org1`)
   Finds lowest bid and prints optimal recommendation.
   ```json
   POST http://localhost:5000/tender/evaluate
   {"tenderId":"T1001"}
   ```

5. **Government Awards Contract** (`Org1`)
   ```json
   POST http://localhost:5000/tender/award
   {"tenderId":"T1001", "contractorId":"Contractor_A"}
   ```

6. **Contractor Logs a Milestone** (`Org2`)
   ```json
   POST http://localhost:5000/milestone/create
   {"tenderId":"T1001", "milestoneId":"M1", "description":"Phase 1 Asphalt", "amount": 250000}
   ```

7. **Auditor Verifies the Milestone** (`Org1`)
   ```json
   POST http://localhost:5000/milestone/verify
   {"milestoneId":"M1", "auditorId":"Auditor_X", "status":"VERIFIED"}
   ```

8. **Government Releases Payment** (`Org1`)
   ```json
   POST http://localhost:5000/payment/release
   {"tenderId":"T1001", "milestoneId":"M1"}
   ```

Enjoy your E-Tendering application demo!
