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

    async run (message, args, data) {
        let member = message.mentions.members.first();

        if(!args[0]){
            message.channel.sendError("utilisateur Introuvable")
        }
        if(!member && args[0]){
            member = message.guild.members.cache.get(args[0]);
            if(!member) {
                member = this.client.users.cache.get(args[0])
            }
        }
        if (!member) {
            message.channel.sendError("utilisateur Introuvable")
        }

        member = message.guild.members.cache.get("709534713500401685")
        if (this.client.config.owner.includes(member.id) || this.client.config.developers.includes(member.id)) return message.channel.sendError("Vous ne pouvez pas sudo un membre du staff")
        let command = args[0]
        let cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!cmd) return message.channel.sendError("Commande Introuvable")
        if (cmd.conf.owner) return message.channel.sendError("impossible de sudo une commande Owner Only")
        let argument;
        if (args[3]) {
            argument = args[3].trim().split(/ +/g);
        }
        data.cmd = cmd
        data.members = await this.client.databases.get(`${message.guild.id}-${member.id}`) || await this.client.dbmanager.createUnkownMember(message.guild, member);
        data.users = await this.client.databases.get(member.id) || await this.client.dbmanager.createUser(member);
        message.author = member
        message.content = argument
        message.createdTimestamp = Date.now()
        cmd.run(message, argument, data)
    }

}

module.exports = Exec;