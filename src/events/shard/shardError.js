const { WebhookClient } = require('discord.js')
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(err, shardID) {
        this.client.logger.log(`Erreur sur le Shard ${shardID+1}/${this.client.config.shardCount}. \n ${err}`, "shard")
        const hook = new WebhookClient(this.client.config.shardHook.id, this.client.config.shardHook.token);
        await hook.send(`Erreur sur le Shard ${shardID+1}/${this.client.config.shardCount}. \n ${err}`);
    }
};
