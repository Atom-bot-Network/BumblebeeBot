const Command = require("../../base/Command.js")
module.exports = class LeaderBoard extends Command {
    constructor(client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            permission: ["SEND_MESSAGES"],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
        });
    }
    async run(message, args, data) {
        let msg = await message.channel.send("Loading ...")
        let i0 = 0;
        let i1 = 10;
        let page = 1;
        let arr = []
        let membersArr = await message.guild.members.cache.array();
        await membersArr.asyncForEach(async m => {
            let object = {
                name: "unknown",
                regular: 0,
                fake: 0,
                leaves: 0,
                uses: 0,
                total: 0,
            }
            let data =  await this.client.databases.get(`${message.guild.id}-${m.id}`)
            if (data) {
                let counter = 0
                await m.guild.fetchInvites().then(i => {
                    i.map(x => {
                        if (x.inviter.id === m.id) {
                            counter = counter + x.uses
                        }
                    })
                })
                object.name = m.user.tag
                object.regular = data.regular
                object.fake = data.fake
                object.leaves = data.leaves
                object.uses = counter
                object.total = data.regular - data.fake - data.leaves
                if (!data.regular && !data.leaves) return undefined;
                return arr.push(object)
            }
        })
        let guilds = arr;
        let description =
            `Leaderboard ${message.guild.name}\n\n`+
            guilds.sort((a,b) => b.total-a.total).map((r) => r)
                .map((r, i) => `**${i + 1 === 1 ? '🏆' : 1 && i + 1 === 2 ? '🥈' : 2 && i + 1 === 3 ? '🥉' : i + 1}** ${r.name} - \`${r.total} invites - (Regular: ${r.regular}, Fake: ${r.fake}, Leave: ${r.leaves}, Uses: ${r.uses})\``)
                .slice(0, 10)
                .join("\n");
        let embed = new this.client.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle(`Page: ${page}/${Math.ceil(guilds.length/10)}`)
            .setDescription(description);
        await msg.edit(embed);
        await msg.react("⬅");
        await msg.react("➡");
        await msg.react("❌");
        let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
        collector.on("collect", async(reaction, user) => {
            if(reaction._emoji.name === "⬅") {
                i0 = i0-10;
                i1 = i1-10;
                page = page-1;
                if(i0 < 0){
                    return msg.delete();
                }
                if(!i0 || !i1){
                    return msg.delete();
                }
                description = `Leaderboard ${message.guild.name}\n\n`+
                    guilds.sort((a,b) => b.total-a.total).map((r) => r)
                        .map((r, i) => `**${i + 1 === 1 ? '🏆' : 1 && i + 1 === 2 ? '🥈' : 2 && i + 1 === 3 ? '🥉' : i + 1}** ${r.name} - \`${r.total} invites - $(Regular: ${r.regular}, Fake: ${r.fake}, Leave: ${r.leaves}, Uses: ${r.uses})\``)
                        .slice(i0, i1)
                        .join("\n");
                embed.setTitle(`Page: ${page}/${Math.round(guilds.length/10)}`)
                    .setDescription(description);
                await msg.edit(embed);
            }
            if(reaction._emoji.name === "➡"){
                i0 = i0+10;
                i1 = i1+10;
                page = page+1;
                if(i1 > guilds.length + 10){
                    return msg.delete();
                }
                if(!i0 || !i1){
                    return msg.delete();
                }
                description = `Leaderboard ${message.guild.name}\n\n`+
                    guilds.sort((a,b) => b.total-a.total).map((r) => r)
                        .map((r, i) => `**${i + 1 === 1 ? '🏆' : 1 && i + 1 === 2 ? '🥈' : 2 && i + 1 === 3 ? '🥉' : i + 1}** ${r.name} - \`${r.total} invites - $(Regular: ${r.regular}, Fake: ${r.fake}, Leave: ${r.leaves}, Uses: ${r.uses})\``)
                        .slice(i0, i1)
                        .join("\n");
                embed.setTitle(`Page: ${page}/${Math.round(guilds.length/10)}`)
                    .setDescription(description);
                await msg.edit(embed);
            }
            if(reaction._emoji.name === "❌"){
                return msg.delete();
            }
            await reaction.users.remove(message.author.id);
        });
    }
}
