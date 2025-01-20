import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export class AzureKeyValutService {
    constructor(keyVaultName) {
        const url = `https://${keyVaultName}.vault.azure.net`;
        this.credential = new DefaultAzureCredential();
        this.client = new SecretClient(url, this.credential);
    }

    // Create a secret
    // The secret can be a string of any kind. For example,
    // a multiline text block such as an RSA private key with newline characters,
    // or a stringified JSON object, like `JSON.stringify({ mySecret: 'SECRET_VALUE'})`.
    async createSecret(secretName, secretValue) {
        try {
            const result = await this.client.setSecret(secretName, secretValue);
            console.log('Secret Created Successfully: ', result);
            return result;
        } catch(error) {
            console.error('Error Creating Secret: ', error)
            return null;
        }
    }

    // Retrieve the secret
    async getSecret(secretName) {
        try {
            const secret = await this.client.getSecret(secretName);
            console.log('Secrete Value Restrieved!');
            return secret.value || null;
        } catch(error) {
            console.error('Error Retrieving Secret', error);
            return null;
        }
    }

    // Update secret properties (cannot update the secret itself)
    async updateSecret(secretName) {
        try {
            const updatedSecret = this.client.updateSecretProperties(secretName, version, { enabled });
            console.log(`Updated secret: ${secretName}`, updatedSecret);
        } catch (error) {
            console.error(`Error updating secret '${secretName}':`, error);
        }
    }

    // Delete the secret
    async deleteSecret(secretName) {
        try {
            const deletePoller = await this.client.beginDeleteSecret(secretName);
            await deletePoller.pollUntilDone();
            console.log(`Deleted secret: ${secretName}`);
        } catch (error) {
            console.error(`Error deleting secret '${secretName}':`, error);
        }
    }
}