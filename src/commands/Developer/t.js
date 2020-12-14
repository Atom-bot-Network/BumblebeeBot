const Command = require("../../base/Command.js")
module.exports = class Cmd extends Command {
    constructor(client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
        });
    }
    async run(message) {
        let perm = ["SEND_MESSAGES", "EMBED_LINKS"]
        let arr = []
        perm.forEach(p => {
            arr.push(`\`${message.language(`permissions:${p}`)}\``)
        })
        message.channel.send(message.language('error:INHIBITOR_MISSING_BOT_PERMS', {perm: arr.map(p => p).join(', ')}));
    }
}


