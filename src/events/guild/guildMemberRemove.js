const {formatMessage} = require("../../utils/functions");

module.exports = class {
    constructor(client) {
        this.client = client;
    }
    async checkCache(guild) {
        let cache = this.client.invitations[guild.id]
        if (!cache) {
            const member = await guild.members.fetch(this.client.user.id).catch(() => {});
            let i = process.argv.includes("--uncache") ? new Map() : (member.hasPermission("MANAGE_GUILD") ? await guild.fetchInvites().catch(() => {}) : new Map());
            this.client.invitations[guild.id] = i || new Map();
        }
    }
    async run(member) {
        await this.checkCache(member.guild)
        let inviter
        let inviterData
        let invite
        let guildData = await this.client.databases.get(member.guild.id)
        let memberData = await this.client.databases.get(`${member.guild.id}-${member.id}`)
        if (memberData) {
            inviter = memberData.invited && memberData.invited.type === "normal" && memberData.invited.inviteData ? await this.client.resolveUser(memberData.invited.inviterID) : null
            inviterData = inviter ? await this.client.dbmanager.getMember(member.guild, inviter) : null;
            invite = memberData.invited.inviteData;
            if (inviter) {
                let l = inviterData.leaves
                l++
                let r = inviterData.regular
                r--
                await this.client.databases.set(`${member.guild.id}-${inviter.id}.leaves`, l)
                await this.client.databases.set(`${member.guild.id}-${inviter.id}.regular`, r)
                await this.client.databases.push(`${member.guild.id}-${inviter.id}.invitedUsersLeft`, member.id)
                if(inviterData.invitedUsers.includes(member.id)){
                    await this.client.dbmanager.removeInvitedUser(member.guild, inviter, member.id);
                }
            }
        }


        let d
        if (inviter)
            d = await this.client.databases.get(`${member.guild.id}-${inviter.id}`)

        let channel = member.guild.channels.cache.get(guildData.leaves.channel)
        let string =  guildData.leaves.message
        if (channel) {
            if (!memberData) {
                channel.send(member.guild.language("misc:LEAVE_UNKNOWN", {
                    user: member.user.tag
                }));
            }
            if(invite){
                console.log(invite.inviter)
                let formattedMessage = formatMessage(string, member, inviter, invite, d)
                channel.send(formattedMessage);
            } else if(memberData.invited.type === "vanity"){
                channel.send(member.guild.language("misc:LEAVE_VANITY", {
                    user: member.user.tag
                }));
            } else if(memberData.invited.type === "oauth"){
                channel.send(member.guild.language("misc:LEAVE_OAUTH2", {
                    user: member.user.tag
                }));
            } else if(memberData.invited.type === "unkown"){
                channel.send(member.guild.language("misc:LEAVE_UNKNOWN", {
                    user: member.user.tag
                }));
            } else {
                channel.send(member.guild.language("misc:LEAVE_UNKNOWN", {
                    user: member.user.tag
                }));
            }
        }
        await this.client.dbmanager.removeMember(member.guild, member)
    }
};





