# Real-World Cloud Deployment Guide

This document outlines the professional DevOps strategy required to move your Decentralized E-Tendering application onto a real, internet-hosted Hyperledger Fabric platform.

By completing these steps, **100% of your data storage and transaction verification will happen exclusively on the decentralized blockchain cloud nodes.** The Express Backend Server is designed to act solely as a zero-state proxy router. It holds no databases.

## Platform Choice: Kaleido Health
For project submissions needing a professional Managed Blockchain-as-a-Service architecture without the prohibitive manual costs of AWS Managed Blockchain, **Kaleido** (https://kaleido.io) is considered the industry standard.

### Step 1: Create Your Blockchain Consortia
1. Log into your cloud provider (Kaleido).
2. Create a **Consortium** (e.g., "National Tendering Consortium").
3. Create a **Network Environment** (Select "Hyperledger Fabric" as the protocol over Ethereum or Quorum).

### Step 2: Establish the Independent Nodes (Peers)
You must physically reflect the network architecture:
1. Spin up a new node and name it `Org1` (Government).
2. Spin up a second node and name it `Org2` (Contractor).
3. Create a channel named `tenderchannel` and invite both the Government node and Contractor node to join it.

### Step 3: Securely Deploy Chaincode
You will deploy the exact code we wrote to the Cloud:
1. Zip up the `chaincode/tendercc` folder (ensure it includes the `collections_config.json`!).
2. In your cloud dashboard, locate the "Smart Contracts" deployment section.
3. Upload the `.zip` source code. It will be installed onto the Government Peer and Contractor Peer. Instantiation requires you to map the Private Data Collection policies.

---

## Modifying the Express Backend Connectors

Once the cloud nodes are humming on Kaleido/AWS, you must securely link your local `backend/` server to the internet.

### Step 4: Download The Connection Profile
The Cloud platform will provide you an option to "Download Application Connection Profile". 
1. Create a folder locally at `backend/config/`.
2. Save the downloaded json payload as `backend/config/connection.json`. This map tells your server where the remote computers live.

### Step 5: Download Required Identity Wallets
You cannot transact without heavy cryptography. You must "Enroll" a user inside the Cloud Dashboard.
1. Create a folder locally at `backend/wallet/Org1_User1/`
2. Through the Cloud UI, generate an identity explicitly for the Government. Download the resulting certificates into that folder. Ensure they are named:
   - `certificate.pem` (Your public identity)
   - `private_key.pem` (Your secret signing key)
   - `tls_ca.pem` (The TLS certificate to establish HTTPS/gRPCs to the cloud)

Do the same for Contractor `backend/wallet/Org2_User1/`.

### Final Step: Start Your Server
Once those secure configs are present, your backend server acts purely as the gateway:

```bash
cd backend
npm start
```

When a user in your Vite front-end clicks "Submit Bid," the payload hits the Express Backend, which uses the explicit downloaded Private Key to cryptographically sign the data, and fires it over secure `gRPCs` to the Kaleido/AWS Cloud node, which then natively mints it to the public or private ledger permanently!
