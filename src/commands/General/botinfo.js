const Command = require("../../base/Command.js"),
    {version} = require('discord.js'),
    os = require('os');
module.exports = class Botinfo extends Command {
    constructor (client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            aliases: ["bi","binfo", "boti",],
            permission: ["SEND_MESSAGES"],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
        });
    }
    async run (message) {
        let guildsCounts = await this.client.shard.fetchClientValues("guilds.cache.size"),
            guildsCount = guildsCounts.reduce((p, count) => p+count),
            usersCounts = await this.client.shard.fetchClientValues("users.cache.size"),
            usersCount = usersCounts.reduce((p, count) => p+count),
            channelsCounts = await this.client.shard.fetchClientValues("channels.cache.size"),
            channelsCount = channelsCounts.reduce((p, count) => p+count);
        let v = await this.client.shard.broadcastEval((client) =>{
            let size = 0
            this.guilds.cache.map(async g => { size = size + client.invitations[g.id].size})
            return size
        })
        let invitCount = v.reduce((a,b) => a+b)
        const owner = []
        this.client.config.owner.forEach(o => {
            let user = this.client.users.cache.get(o).tag;
            owner.push(user);
        })
        let embed = new this.client.MessageEmbed()
            .setTitle(message.language('general/botinfo:INFO', {client: this.client.user.username}))
            .addField(`:clipboard: ${message.language('general/botinfo:NAME')}`, this.client.user.username, true)
            .addField(":wrench: "+message.language('general/botinfo:DISCRIMINATOR') , "#" + this.client.user.discriminator, true)
            .addField("<:verified:707704606909530143>  "+message.language('general/botinfo:DEVELOPPER'), owner.join('\n'), true)
            .addField("<:bbbot:773088453260869652> BumblebeeBot", require("../../../package.json").version)
            .addField("<:data:697043020935331885> discord.js :", 'v'+version, true)
            .addField("<:node:679787852854591499> nodeJs :", process.version, true)
            .addField(`<:os:697043019337302078> ${message.language('general/botinfo:OS')}`, `${os.platform()}`, true)
            .addField(`<:setting:697043025444208704> Architecture`, `${os.arch()}`, true)
            .addField(`<:cpu:697043024324067358>  ${message.language('general/botinfo:PROCESSOR')}`, `${os.cpus().map(i => `${i.model}`)[0]}`, true)
            .addField("<:ram:697043027482378270> "+message.language('general/botinfo:RAM'), (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB", true)
            .addField("<:clock:697043026496979064>  Uptime :", `${(Math.round(this.client.uptime / (1000 * 60 * 60)))} ${message.language('utils:HOURS')} ${(Math.round(this.client.uptime / (1000 * 60)) % 60)} ${message.language('utils:MINUTES')} ${(Math.round(this.client.uptime / 1000) % 60)} ${message.language('utils:SECONDS')}`, true)
            .addField('-------', 'Stats')
            .addField(message.language('utils:SERVERS'), guildsCount, true)
            .addField(message.language('utils:MEMBERS'), usersCount, true)
            .addField(message.language('utils:CHANNELS'), channelsCount, true)
            .addField(message.language('utils:INVITS'), invitCount,true)
            .addField(message.language('utils:HI'), `${message.language('utils:SUPPORT', { link: this.client.link.support })} - ${message.language('utils:INVIT', { link: this.client.link.invite })}`, false)
        message.channel.send(embed);
    }
}

