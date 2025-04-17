import { createSignerVerifier, digest, ES256, generateSalt } from './utils';

export const createSdJwt = async (privateKey = null, publicKey = null) => {
    // Create a signer and verifier for issuing and verifying SDJwt credentials
    const { signer, verifier } = await createSignerVerifier(privateKey, publicKey);

    const config = {
        signer,
        verifier,
        signAlg: ES256.alg,
        hasher: digest,
        hashAlg: 'sha-256',
        saltGenerator: generateSalt,
    }
    // Initialize the SDJwt instance with the required configuration
    const sdjwt = new SDJwtVcInstance(config);


    // Return an object containing utility methods to interact with SDJwt
    return {
        // Method to issue a signed SDJwt credential
        async issueStudentIdCredential(claim) {
            const claims = {
                studentId: claim
            };
            const disclosureFrame = { _sd: ['studentId'] }
            try {
                return await sdjwt.issue({
                    iss: 'TrinCredIssuer',
                    iat: new Date().getTime(),
                    vct: 'trin.coll.student_id_sd_jwt_vc',
                    ...claims
                }, disclosureFrame);
            } catch (error) {
                console.error("Error issuing credential: ", error);
                return "";
            }
        },
        // Method to validate a given SDJwt credential
        async validateCredential(encodedSDJwt) {
            try {
                return await sdjwt.validate(encodedSDJwt);
            } catch (error) {
                console.error("Error validating: ", error);
                return false;
            }
        },
    };
};