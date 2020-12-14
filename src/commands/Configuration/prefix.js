const Command = require("../../base/Command.js");
module.exports = class Setprefix extends Command {
    constructor (client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            permission: ["MANAGE_GUILD", "SEND_MESSAGES", "EMBED_LINKS"],
            botPermissions: [ "SEND_MESSAGES" ],
        });
    }
    async run (message, args , data) {
        let old = data.settings.prefix,
            prefix = args[0];
        if(!prefix) return message.channel.sendWarn(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:VALID_PREFIX`));
        if(prefix.length > 5) return message.channel.sendWarn(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:CHARACTERS`));
        await this.client.databases[1].set(`${message.guild.id}.prefix`, prefix)
        return message.channel.sendSuccess(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:SUCCESS`, {
            prefix: prefix,
            old: old
        }));
    }

}