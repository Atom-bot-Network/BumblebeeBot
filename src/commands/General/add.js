const Command = require("../../base/Command.js"),
    {MessageEmbed} = require(`discord.js`),
    ms = require(`ms`)
module.exports = class Invite extends Command {
    constructor (client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            aliases: ["i","invit"],
            permission: ["SEND_MESSAGES"],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
        });
    }

    async run (message, args, data) {
        let embed = new this.client.MessageEmbed()
            .setAuthor(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:INVIT`))
            .addField(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:1`), message.language(`${data.cmd.help.category}/${data.cmd.help.name}:GEN`))
            .addField(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:SUPP`), message.language(`${data.cmd.help.category}/${data.cmd.help.name}:GEN`))
        let new_embed = new this.client.MessageEmbed()
            .setAuthor(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:INVIT`))
        new_embed.addField(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:1`), message.language(`${data.cmd.help.category}/${data.cmd.help.name}:CLICK`) + `(https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=-1)`)
        new_embed.addField(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:SUPP`), `${message.language(`${data.cmd.help.category}/${data.cmd.help.name}:CLICK`)}(${this.client.link.support})`)
        message.channel.send(embed).then(m => {
            setTimeout(function () {
                m.edit(new_embed);
            }, ms("1.5s"));
        })
    }
}