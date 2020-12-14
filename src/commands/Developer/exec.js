const Command = require("../../base/Command.js");
let { exec } = require('child_process');
class Exec extends Command {
    constructor (client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            enabled: true,
            guildOnly: true,
            aliases: [],
            permission: false,
            botPermissions: [ "SEND_MESSAGES" ],
            owner: true
        });
    }
    async run (message, args) {
        exec(`${args.join(' ')}`, (error, stdout) => {
            let response = (error || stdout);
            if (!error) message.channel.send(`\\✅ | L'execution s'est terminée sans problêmes :`);
            else message.channel.send(`\\❌ | Une erreur est survenue lors de l'exécution :`);
            message.channel.send(`${response}`, {
                code: "js",
                split: "\n"
            }).catch(e => console.log(e));
        });
    }
}

module.exports = Exec;