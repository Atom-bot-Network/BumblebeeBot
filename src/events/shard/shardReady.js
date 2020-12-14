const { WebhookClient } = require('discord.js')
module.exports = class {
    constructor (client) {
        this.client = client;
    }
    async run (shardID, unavailableGuilds) {
        let guildShardCount = await this.client.shard.fetchClientValues("guilds.cache.size");

        this.client.logger.log(`Shard ${shardID+1}/${this.client.config.shardCount} démarré, ${unavailableGuilds ? unavailableGuilds.size : "0"} serveurs indisponibles, ${guildShardCount} serveurs en cache`, "shard")
        const hook = new WebhookClient(this.client.config.shardHook.id, this.client.config.shardHook.token);
        await hook.send(`Shard ${shardID+1}/${this.client.config.shardCount} démarré, ${unavailableGuilds ? unavailableGuilds.size : "0"} serveurs indisponibles, ${guildShardCount} serveurs en cache`);

    }
}