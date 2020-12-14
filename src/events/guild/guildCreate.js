const { WebhookClient } = require('discord.js');
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
    async checkCache(guild) {
        let cache = this.client.invitations[guild.id]
        if (!cache) {
            const member = await guild.members.fetch(this.client.user.id).catch(() => {});
            let i = process.argv.includes("--uncache") ? new Map() : (member.hasPermission("MANAGE_GUILD") ? await guild.fetchInvites().catch(() => {}) : new Map());
            this.client.invitations[guild.id] = i || new Map();
        }
    }
    async run (guild) {
        await this.checkCache(guild)
        await this.client.dbmanager.createGuild(guild)
        this.client.emit("setGame", this.client)
        guild.fetchAuditLogs({type: "BOT_ADD"}).then(audit => audit.entries.first()).then(entry => {
            if (entry.target.id === this.client.user.id) {
                let member = guild.members.cache.get(entry.executor.id)
                let embed1 = new this.client.MessageEmbed()
                    .setAuthor("fr-FR")
                    .setDescription(`**Merci d'avoir Ajouté \`Bumblebee\` sur __${guild.name}__ 
                    Pour Changer la langue du bot, veuillez taper le commande \`${this.client.config.prefix}setlang\`
                    Pour afficher le menu d'aide, tapez \`${this.client.config.prefix}help\`
                    Pour voir votre nombre d'invitation, tapez \`${this.client.config.prefix}invite\`
                    Merci de l'ajoute de notre bot sur votre serveur, voici le serveur support au cas où [Cliquez Ici](https://discord.gg/XzYuZFtFVr)**`)
                member.send(":flag_fr:", embed1)
                if(!member.guild.me.hasPermission("MANAGE_GUILD")) {
                    member.send(new this.client.MessageEmbed().setDescription("Pour fonctionner correctement je dois avoir la permission \`MANAGE_GUILD\`, merci de me la donner au plus vite pour éviter tout **disfonctionnement**"))
                }
            }
        })
        let guildsCounts = await this.client.shard.fetchClientValues("guilds.cache.size");
        let guildsCount = guildsCounts.reduce((p, count) => p+count);
        let owner = this.client.users.cache.get(guild.ownerID)
        let embed = new this.client.MessageEmbed()
            .setAuthor(guild.name)
            .setThumbnail(guild.iconURL({dynamic: true, size: 1024, format: "png"}))
            .addField('Merci',`Au serveur ${guild.name} de m'avoir ajouté, je suis maintenant sur ${guildsCount} serveurs`)
            .addField('ID', guild.id, true)
            .addField('Membres', `${guild.memberCount - guild.members.cache.filter(m => m.user.bot).size} membres | ${guild.members.cache.filter(m => m.user.bot).size} bots`)
            .addField('Salons', `${guild.channels.cache.filter(ch => ch.type === 'text').size} textuels | ${guild.channels.cache.filter(ch => ch.type === 'voice').size} ${(guild.channels.cache.filter(ch => ch.type === 'voice').size > 1) ? 'vocaux' : 'vocal'} | ${guild.channels.cache.filter(ch => ch.type === 'category').size} catégories`)
            .addField('Date de création', await this.printDateonts(guild.createdTimestamp), true)
            .addField('Fondateur', `${owner.username}#${owner.discriminator}`)
        const hook = new WebhookClient(this.client.config.guildLogHook.id, this.client.config.guildLogHook.token);
        await hook.send(embed);
    }
}

