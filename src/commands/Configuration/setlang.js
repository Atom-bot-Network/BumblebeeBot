const Command = require("../../base/Command.js");
module.exports = class SetLang extends Command {
    constructor (client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            permission: ["MANAGE_GUILD", "SEND_MESSAGES", "EMBED_LINKS"],
            botPermissions: [ "SEND_MESSAGES" ],
        });
    }
    async run (message, args , data) {
        let languages = [
                "fr-FR",
                //"en-EN"
            ],
            l = {
                "fr": "fr-FR"
                //"en": "en-EN"
            },
            old = data.settings.lang,
            lang = l[args[0]];
        if(!languages.includes(lang)) return message.channel.sendError(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:VALID_LANG`, {
            lang: languages.join("\n")
        }));
        await this.client.databases.set(`${message.guild.id}.lang`, lang);
        return message.channel.sendSuccess(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:SUCCESS`, {
            new: lang,
            old: old
        }));
    }
}