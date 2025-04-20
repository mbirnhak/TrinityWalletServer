import { ES256, digest, generateSalt } from '@sd-jwt/crypto-nodejs';
export { digest, generateSalt, ES256 };

export const createSignerVerifier = async (privateKey, publicKey) => {
  let privKey, pubKey;
  if (!(privateKey && publicKey)) {
    const keyPair = await ES256.generateKeyPair();
    privKey = keyPair.privateKey;
    pubKey = keyPair.publicKey;
  } else {
    privKey = privateKey;
    pubKey = publicKey;
  }
  return {
    signer: await ES256.getSigner(privKey),
    verifier: await ES256.getVerifier(pubKey),
  };
};