module.exports = class {

    constructor (client) {
        this.client = client;
    }
    async checkCache(guild) {
        let cache = this.client.invitations[guild.id]
        if (!cache) {
            const member = await guild.members.fetch(this.client.user.id).catch(() => {});
            let i = process.argv.includes("--uncache") ? new Map() : (member.hasPermission("MANAGE_GUILD") ? await guild.fetchInvites().catch(() => {}) : new Map());
            this.client.invitations[guild.id] = i || new Map();
        }
    }
    async run (invite) {
        await this.checkCache(invite.guild)
        // If the client isn't fetched
        if(!this.client.fetched) return;
        if(!this.client.invitations[invite.guild.id]) return;
        // Add the invite to the cache
        this.client.invitations[invite.guild.id].set(invite.code, invite);
    }

};
