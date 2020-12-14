const Command = require("../../base/Command.js"),
Discord = require('discord.js');

class Eval extends Command {

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

    async run (message, args, data) {
        const content = message.content.split(' ').slice(1).join(' ');
        const result = new Promise((resolve, reject) => resolve(eval(content)));
        return result.then(output => {
            if (typeof output !== 'string') output = require('util').inspect(output, { depth: 0 });
            if (output.includes(this.client.token)) output = output.replace(this.client.token, 'T0K3N');
            return message.channel.send(output, { code: 'js' });
        }).catch(err => {
            err = err.toString();
            if (err.includes(this.client.token)) err = err.replace(this.client.token, '`T0K3N`');
            return message.channel.send(err, { code: 'js' })
        });
    }

}

module.exports = Eval;