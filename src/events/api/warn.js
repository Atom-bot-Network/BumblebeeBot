module.exports = class {
    constructor(client) {
        this.client = client;
    }
    async run(i) {
        this.client.logger.log(`Warn: \n ${i}`, "warn")
    }
}