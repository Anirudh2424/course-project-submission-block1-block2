const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function enroll() {
    try {
        // Construct the Kaleido CA URL using the App Credential you created for basic authentication
        const caURL = 'https://k0n2lhndvu:OWWkPN5XqhLF19A73oOm1WADm8zjpTC1MpGcP6F-Eww@k0f605r1mv-k0kdwgwdvn-fabric-ca.kr0-aws.kaleido.io';
        
        console.log('Connecting to CA at:', caURL);
        const ca = new FabricCAServices(caURL);

        console.log('Enrolling appadmin...');
        // Enroll the admin user using the secret you just generated
        const enrollment = await ca.enroll({
            enrollmentID: 'appadmin',
            enrollmentSecret: 'mtvNExtRNOej'
        });

        // Ensure wallet directory exists
        const walletPath = path.join(__dirname, 'wallet', 'Org1_admin');
        if (!fs.existsSync(walletPath)) {
            fs.mkdirSync(walletPath, { recursive: true });
        }

        // Save Private Key
        const privKeyPath = path.join(walletPath, 'private_key.pem');
        fs.writeFileSync(privKeyPath, enrollment.key.toBytes());
        console.log('Successfully saved private_key.pem');

        // Save Certificate
        const certPath = path.join(walletPath, 'certificate.pem');
        fs.writeFileSync(certPath, enrollment.certificate);
        console.log('Successfully saved certificate.pem');

        console.log('\nEnrollment completely successful! Your wallet is ready.');
    } catch (error) {
        console.error(`Failed to enroll admin user: ${error}`);
    }
}

enroll();
