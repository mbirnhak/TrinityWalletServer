import express from "express";
import { AzureKeyValutService } from "./Azure/AzureKeyVaultService.mjs";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import { CredentialIssuance } from "./Issuance/CredentialIssuance.mjs";

// Configure environment variables
dotenv.config();
const port = process.env.PORT || 3000; // Handled by Vercel
const keyVaultName = process.env.AZURE_KEY_VAULT_NAME;
const secretName = process.env.AZURE_SECRET_NAME;
const privateKey = JSON.parse(process.env.PRIVATE_KEY);
const publicKey = JSON.parse(process.env.PUBLIC_KEY);
const keyVaultService = new AzureKeyValutService(keyVaultName);
const issuanceService = new CredentialIssuance();
await issuanceService.initialize(privateKey, publicKey);

// Ensure all env variables are loaded
if (!port || !keyVaultName || !secretName) {
    console.error("Missing required environment variables.");
    process.exit(1);
}

// Load SSL/TLS cert. and key (Now handled by Vercel)
// const privKey = fs.readFileSync("key.pem", "utf-8");
// const certificate = fs.readFileSync("cert.pem", "utf-8");
// const credentials = { key: privKey, cert: certificate };

// Create http redirect to https (Now handled by Vercel)
// http.createServer((res, req) => {
//     res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
//     res.end();
// }).listen(80);

const app = express();
app.use(cors())

app.get('/', (req, res) => {
    res.send('Welcome to my Server!')
});

app.get('/azure-secret', async (req, res) => {
    try {
        const secret = await keyVaultService.getSecret(secretName);
        if (secret) {
            return res.status(200).json({ secret });
        } else {
            return res.status(404).json({ error: 'Secret not found' });
        }
    } catch (error) {
        console.error('Error Retrieving Secret: ', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/issuance-secrets', (req, res) => {
    try {
        const secrets = issuanceService.getSecret();
        if (secrets) {
            return res.status(200).json({ secrets });
        } else {
            return res.status(404).json({ error: 'Secrets not found' });
        }
    } catch (error) {
        console.error('Error Retrieving Issuance Secrets: ', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/credential-issuance', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ error: 'Missing required parameter: username' });
        }
        const credential = await issuanceService.retrieveCredential(username);
        const ver = await issuanceService.verifyCredential(credential);
        console.log("Verified: ", ver);
        if (credential !== null) {
            return res.status(200).json({ credential });
        } else {
            return res.status(404).json({ error: 'Credential not found' });
        }
    } catch (error) {
        console.error('Error Retrieving Issuance Secrets: ', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});

export default app;