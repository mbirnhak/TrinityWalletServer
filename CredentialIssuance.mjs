export class CredentialIssuance {
    constructor(flaskSecret, eidasNodeSecret) {
        this.flaskSecret = flaskSecret
        this.eidasNodeSecret = eidasNodeSecret
    }

    // Return the flask secret and eida node secret needed for interacting with eidas issuance server
    getSecret() {
        return { flaskSecret: this.flaskSecret, eidasNodeSecret: this.eidasNodeSecret }
    }
}