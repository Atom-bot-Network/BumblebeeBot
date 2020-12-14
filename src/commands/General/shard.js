const Command = require("../../base/Command.js")
class Shard extends Command {

    constructor (client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            aliases: ["si","shardinfo",],
            permission: ["SEND_MESSAGES"],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
        });
    }

    async run (message, args, data) {
        let results = await this.client.shard.broadcastEval(() => {
            return [
                Math.round((process.memoryUsage().heapUsed / 1024 / 1024)),
                this.guilds.cache.size,
                this.shard.ids[0],
                Math.round(this.ws.ping),
                (Math.round(this.uptime / (1000 * 60 * 60))),
                (Math.round(this.uptime / (1000 * 60)) % 60),
                (Math.round(this.uptime / 1000) % 60),
                this.users.cache.size
            ]}
        );
        results.forEach((shard) => {
            let b = `[${shard[2]+1}/${this.client.config.shardCount}]`;
            let up = `${shard[4]} ${message.language('utils:HOURS')}, ${shard[5]} ${message.language('utils:MINUTES')} ${message.language('utils:AND')} ${shard[6]} ${message.language('utils:SECONDS')}`;
            let embed = new this.client.MessageEmbed()
                .setColor(data.embed.color)
                .setFooter(data.embed.footer)
                .setAuthor(`${message.language(`${data.cmd.help.category}/${data.cmd.help.name}:SHARD`)} ${b}`)
                .setDescription(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:MESSAGE`, {
                    ram: shard[0],
                    server: shard[1],
                    member: shard[7],
                    uptime: up,
                    ping: shard[3]
                }))
            message.channel.send(embed);
        })



    }

}

module.exports = Shard;