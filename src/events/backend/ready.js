module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run() {
        let invites = {}
        this.client.fetched = true;
        const asyncForEach = async (array, callback) => {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        };
        await asyncForEach(this.client.guilds.cache.array(), async (guild) => {
            const member = await guild.members.fetch(this.client.user.id).catch(() => {});
            let i = process.argv.includes("--uncache") ? new Map() : (member.hasPermission("MANAGE_GUILD") ? await guild.fetchInvites().catch(() => {}) : new Map());
            invites[guild.id] = i || new Map();
        });
        this.client.invitations = invites
        let guildsCounts = await this.client.shard.fetchClientValues("guilds.cache.size");
        let guildsCount = guildsCounts.reduce((p, count) => p+count);
        this.client.emit("setGame", this.client)
        this.client.logger.log(`Loading a total of ${this.client.commands.size} command(s).`, 'log');
        this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${guildsCount} servers.`, "ready");
    }
}  