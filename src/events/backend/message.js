module.exports = class {
    constructor(client) {
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
    async run(message) {
        await this.checkCache(message.guild)
        if (!message.guild) return;
        if (message.channel.type === 'dm') return;
        if (message.author.bot) return;
        if (message.guild && !message.member) {
            await message.guild.members.fetch(message.author.id);
        }
        let data = {};
        data.config = this.client.config;
        let settings = await this.client.databases.get(message.guild.id) || await this.client.dbmanager.createGuild(message.guild);
        let users = await this.client.databases.get(message.author.id) || await this.client.dbmanager.createUser(message.author);
        let members = await this.client.databases.get(`${message.guild.id}-${message.author.id}`) || await this.client.dbmanager.createUnkownMember(message.guild, message.author)
        if (message.mentions.members.first()) {
            let m = message.mentions.members.first()
            let m1 = message.guild.members.cache.get(m.id)
            await this.client.databases.get(`${message.guild.id}-${m1.id}`) || await this.client.dbmanager.createUnkownMember(message.guild, m1).then(console.log)
        }
        let prefix = settings.prefix ? settings.prefix: this.client.config.prefix
        data.prefix = prefix
        message.guild.data = settings
        data.settings = settings
        data.users = users
        data.members = members
        this.client.data = data
        data.embed = {
            color: data.users.color ? data.users.color : this.client.config.embed.color,
            footer: this.client.config.embed.footer.replace(this.client.config.prefix, settings.prefix)
        }
        const prefixMention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
        if (message.content.match(prefixMention)) {
            return message.reply(message.language('utils:PREFIX_INFO', {prefix: prefix}));
        }
        if (message.content.indexOf(prefix) !== 0) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!cmd) return;
        let neededPermission = [];
        let botMember = await message.guild.members.fetch(this.client.user);
        cmd.conf.botPermissions.forEach(perm => {
            if (!botMember.hasPermission(perm)) neededPermission.push(perm);
        });
        let arr = []
        if (neededPermission.length > 0) {
            neededPermission.forEach(p => {
                arr.push(`\`${message.language(`permissions:${p}`)}\``)
            })
            return message.channel.send(message.language('error:INHIBITOR_MISSING_BOT_PERMS', {perm: arr.map(p => p).join(', ')}));
        }
        if (cmd.conf.permission) {
            if (!message.member.hasPermission(cmd.conf.permission)) return message.channel.send(message.language('error:INHIBITOR_PERMISSIONS', {perm: cmd.conf.permission}));
        }
        if (!cmd.conf.enabled) return message.channel.send(message.language('error:COMMAND_DISABLED'));
        if (cmd.conf.owner && !this.client.config.owner.includes(message.author.id)) return undefined
        if (cmd.conf.premium && !settings.premium) return message.channel.sendWarn(message.language('error:COMMAND_PREMIUM', {
            prefix: settings.prefix
        }))
        data.cmd = cmd;
        this.client.logger.log(`${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");
        cmd.run(message, args, data);
    }
};


