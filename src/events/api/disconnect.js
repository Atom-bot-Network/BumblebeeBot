module.exports = class {
    constructor(client) {
        this.client = client;
    }
    async run() {
        this.client.logger.log("le bot se déconnecte", "log")
    }
}