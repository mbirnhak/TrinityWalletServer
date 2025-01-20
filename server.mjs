import express from "express";
import { AzureKeyValutService } from "./AzureKeyVaultService.mjs";
import dotenv from "dotenv";
import cors from "cors";
import https from "https"
import http from "http"
import fs from "fs";
import { CredentialIssuance } from "./CredentialIssuance.mjs";

// Configure environment variables
dotenv.config();
const port = process.env.PORT;
const keyVaultName = process.env.AZURE_KEY_VAULT_NAME;
const secretName = process.env.AZURE_SECRET_NAME;
const keyVaultService = new AzureKeyValutService(keyVaultName);

const flaskSecret = process.env.FLASK_SECRET_KEY;
const eidasNodeSecret = process.env.EIDASNODE_LIGHTTOKEN_SECRET;
const issuanceService = new CredentialIssuance(flaskSecret, eidasNodeSecret);

// Ensure all env variables are loaded
if (!port || !keyVaultName || !secretName || !flaskSecret || !eidasNodeSecret) {
    console.error("Missing required environment variables.");
    process.exit(1);
}

// Load SSL/TLS cert. and key
const privKey = fs.readFileSync("server.key", "utf-8");
const certificate = fs.readFileSync("server.cert", "utf-8");
const credentials = { key: privKey, cert: certificate };

// Create http redirect to https
http.createServer((res, req) => {
        res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
        res.end();
    })
    
const app = express();
app.use(cors())
app.get('/', (req, res) => {
    res.send('Welcome to my Server!')
});

app.get('/azure-secret', async (req, res) => {
    try {
        const secret = await keyVaultService.getSecret(secretName);
        if(secret) {
            res.status(200).json({ secret });
        } else {
            res.status(404).json({ error: 'Secret not found' });
        }
    } catch(error) {
        console.error('Error Retrieving Secret: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/issuance-secrets', (req, res) => {
    try {
        const secrets = issuanceService.getSecret();
        if (secrets) {
            res.status(200).json({ secrets });
        } else {
            res.status(404).json({ error: 'Secrets not found' });
        }
    } catch (error) {
        console.error('Error Retrieving Issuance Secrets: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

https.createServer(credentials, app).listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});