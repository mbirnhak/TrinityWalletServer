import { createSdJwt } from './SdJwtVc.mjs'

const usersMap = {
    "mbirnhak": 21006302,
    "sdwivedi": 21027665,
};

export class CredentialIssuance {
    async initialize(privateKey = null, publicKey = null) {
        this.sdJwtCreator = await createSdJwt(privateKey, publicKey);
    }

    async retrieveCredential(username) {
        try {
            if (username in usersMap) {
                const studentId = usersMap[username];
                const credential = await this.sdJwtCreator.issueStudentIdCredential(studentId);
                return credential;
            } else {
                console.log("Student username does not exist in database.")
                return null;
            }
        } catch (error) {
            console.log("[Credential Issuance Error]: ", error);
            return null;
        }
    }

    async verifyCredential(credential) {
        try {
            const success = await this.sdJwtCreator.validateCredential(credential);
            return success;
        } catch (error) {
            console.log("[Credential Issuance Error]: ", error);
            return null;
        }
    }
}