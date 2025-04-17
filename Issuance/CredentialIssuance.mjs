import createSdJwt from './SdJwtVc.mjs'

const usersMap = {
    "mbirnhak": 21006302,
    "sdwivedi": 2
};

export class CredentialIssuance {
    async initialize() {
        this.sdJwtCreator = await createSdJwt();
    }

    async retrieveCredential(username) {
        try {
            if (username in usersMap) {
                studentId = usersMap[username];
                const credential = this.sdJwtCreator.issueStudentIdCredential(studentId);
                console.log("Credential: ", credential);
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
}