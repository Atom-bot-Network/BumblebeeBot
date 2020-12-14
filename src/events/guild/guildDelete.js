const { MessageEmbed, WebhookClient } = require('discord.js')
module.exports = class {
    constructor (client) {
        this.client = client;
    }
    async printDateonts(ts, displayh){
        let pdate = new Date(ts);
        let monthNames = [
            "janvier", "février", "mars",
            "avril", "mai", "juin", "juillet",
            "août", "septembre", "octobre",
            "novembre", "décembre"
        ];
        let day = pdate.getDate();
        let monthIndex = pdate.getMonth();
        let year = pdate.getFullYear();
        let hour = pdate.getHours();
        let minute = pdate.getMinutes();
        let thedate;
        if(displayh){
            thedate = day + ' ' + monthNames[monthIndex] + ' ' + year + " à " + hour + "h" + minute;
        }
        if(!displayh){
            thedate = day + ' ' + monthNames[monthIndex] + ' ' + year
        }
        return thedate;
    }
    async run (guild) {
        await this.client.dbmanager.removeGuild(guild)
        this.client.emit("setGame", this.client)
        let guildsCounts = await this.client.shard.fetchClientValues("guilds.cache.size");
        let guildsCount = guildsCounts.reduce((p, count) => p+count);
        let owner = await this.client.users.fetch(guild.ownerID)
        let embed = new this.client.MessageEmbed()
            .setAuthor(guild.name)
            .setThumbnail(guild.iconURL({dynamic: true, size: 1024, format: "png"}))
            .addField(':cry:',`Le serveur ${guild.name} vient de nous quitter, je suis maintenant sur ${guildsCount} serveurs`)
            .addField('ID', guild.id, true)
            .addField('Membres', `${guild.memberCount - guild.members.cache.filter(m => m.user.bot).size} membres | ${guild.members.cache.filter(m => m.user.bot).size} bots`)
            .addField('Salons', `${guild.channels.cache.filter(ch => ch.type === 'text').size} textuels | ${guild.channels.cache.filter(ch => ch.type === 'voice').size} ${(guild.channels.cache.filter(ch => ch.type === 'voice').size > 1) ? 'vocaux' : 'vocal'} | ${guild.channels.cache.filter(ch => ch.type === 'category').size} catégories`)
            .addField('Date de création', await this.printDateonts(guild.createdTimestamp), true)
            .addField('Fondateur', `${owner.username}#${owner.discriminator}`)
        const hook = new WebhookClient(this.client.config.guildLogHook.id, this.client.config.guildLogHook.token);
        await hook.send(embed);
    }
}
