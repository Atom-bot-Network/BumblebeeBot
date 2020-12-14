module.exports = class {
    constructor(client) {
        this.client = client;
    }
    async run(e) {
        this.client.logger.log(`Nouvelle Erreur: \n ${e}`, "error")
    }
}