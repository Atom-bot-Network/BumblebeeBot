const Command = require("../../base/Command.js"),
    { exec } = require('child_process');
class Reload extends Command {

    constructor (client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            enabled: true,
            guildOnly: true,
            aliases: ["rl"],
            permission: false,
            botPermissions: [ "SEND_MESSAGES" ],
            owner: true
        });
    }

    async run (message) {
        await message.channel.send(`<a:load2:679789707562975281> | Reload en cours`)
        exec(`pm2 restart 0`)


    }

}

module.exports = Reload;