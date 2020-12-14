const Command = require("../../base/Command.js")
module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            permission: ["SEND_MESSAGES"],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
        });
    }
    async run(message, args, data) {
        let debut = Date.now();
        let ping = this.client.databases.ping();
        await message.channel.send("ping")
            .then(async (m) => m.edit(' ', new this.client.MessageEmbed()
                .setAuthor("Pong")
                .addFields(
                    {
                        name: message.language(`${data.cmd.help.category}/${data.cmd.help.name}:MESSAGE`),
                        value: `${Date.now() - debut} ms`,
                        inline: false
                    },
                    {
                        name: message.language(`${data.cmd.help.category}/${data.cmd.help.name}:WS`),
                        value: `${Math.floor(this.client.ws.ping)} ms`,
                        inline: false
                    },
                    {
                        name: message.language(`${data.cmd.help.category}/${data.cmd.help.name}:SHARD`),
                        value: `${await this.client.shard.broadcastEval("Math.round(this.ws.ping)")} ms`,
                        inline: false
                    },
                    {
                        name: message.language(`${data.cmd.help.category}/${data.cmd.help.name}:DB`),
                        value: `${(ping.average)} ms`,
                        inline: false
                    }
                )
            ));
    }
}
