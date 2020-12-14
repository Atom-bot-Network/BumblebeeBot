const Command = require("../../base/Command.js")
module.exports = class Invite extends Command {
    constructor(client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            permission: ["SEND_MESSAGES"],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
        });
    }
    async run(message, args) {
        let member = message.mentions.members.first();
        if(!args[0]){
            member = message.author;
        }
        if(!member && args[0]){
            member = message.guild.members.cache.get(args[0]);
            if(!member) {
                member = this.client.users.cache.get(args[0]);
            }
        }
        if (!member) {
            member = message.author
        }
        member = message.guild.members.cache.get(member.id);
        let d = await this.client.databases.get(`${message.guild.id}-${member.id}`),
            total = d.regular - d.fake - d.leaves;
        if (total < 0) total = 0;
        let counter = 0;
        await message.guild.fetchInvites().then( i => {
            i.map(x => {
                if (x.inviter.id === member.id) {
                    counter = counter + x.uses
                }
            })
        })
        let embed = new this.client.MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL({size: 1024, dynamic: true, format: "png"}))
            .setThumbnail(message.guild.iconURL({size: 1024, dynamic: true, format: "png"}))
            .setDescription(`**${total} invites - (Regular: ${d.regular}, Fake: ${d.fake}, Leave: ${d.leaves}, Uses: ${counter})**`)
        message.channel.send(embed)
    }
}
