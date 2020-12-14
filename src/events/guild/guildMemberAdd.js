const {formatMessage} = require("../../utils/functions");
const {isEqual} = require("../../utils/functions");

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
        let guildData = await this.client.databases.get(member.guild.id)
        let userData =  await this.client.dbmanager.getUser(member)
        if (!userData) {
            await this.client.dbmanager.createUser(member)
        }
        console.log("Calculating for member "+member.id);

        let invite = null;
        let vanity = false;
        let oauth = false;
        let perm = false;

        if(!member.guild.me.hasPermission("MANAGE_GUILD")) perm = true;


        if(member.user.bot){
            oauth = true;
        } else if(!perm) {

            // Fetch the current invites of the guild
            let guildInvites = await member.guild.fetchInvites().catch(() => {});
            // Fetch the invites of the guild BEFORE that the member has joined
            let oldGuildInvites = this.client.invitations[member.guild.id];
            if(guildInvites && oldGuildInvites){
                // Update the cache
                this.client.invitations[member.guild.id] = guildInvites;
                // Find the invitations which doesn't have the same number of use
                let inviteUsed = guildInvites.find((i) => oldGuildInvites.get(i.code) && ((oldGuildInvites.get(i.code).hasOwnProperty("uses") ? oldGuildInvites.get(i.code).uses : "Infinite") < i.uses));
                if((isEqual(oldGuildInvites.map((i) => `${i.code}|${i.uses}` ).sort(), guildInvites.map((i) => `${i.code}|${i.uses}` ).sort())) && !inviteUsed && member.guild.features.includes("VANITY_URL")){
                    vanity = true;
                } else if(!inviteUsed){
                    let newAndUsed = guildInvites.filter((i) => !oldGuildInvites.get(i.code) && i.uses === 1);
                    if(newAndUsed.size === 1){
                        inviteUsed = newAndUsed.first();
                    }
                }
                if(inviteUsed && !vanity) invite = inviteUsed;
            }
            if(!invite){
                const targetInvite = guildInvites.some((i) => i.targetUser && (i.targetUser.id === member.id));
                if (targetInvite.uses === 1) {
                    invite = targetInvite;
                }
            }
        }

        let inviter = invite ? await this.client.resolveUser(invite.inviter.id) : null;
        let inviterData = inviter ? await this.client.dbmanager.getMember(member.guild, member) : null;
        // If we know who invited the member
        if(invite){
            // We look for the member in the server members
            let inviterMember = member.guild.members.cache.get(inviter.id);
            // If it does exist
            if(inviterMember){
                let inviterDatas = await this.client.databases.get(`${member.guild.id}-${inviter.id}`)
                // If the member had previously invited this member and they have left
                if(inviterDatas.invitedUsersLeft.includes(member.id)){
                    // It is removed from the invited members
                    await this.client.dbmanager.removeInvitedUserLeft(member.guild, inviter, member.id);
                    // We're removing a leave
                    let l = inviterDatas.leaves
                    l--
                    await this.client.databases.set(`${member.guild.id}-${inviter.id}.leaves`, l)
                }
                // If the member had already invited this member before
                if(inviterDatas.invitedUsers.includes(member.id)){
                    // We increase the number of fake invitations
                    await this.client.databases.add(`${member.guild.id}-${inviter.id}.fake`, 1)
                    // We increase the number of regular invitations
                    await this.client.databases.add(`${member.guild.id}-${inviter.id}.regular`, 1)
                } else {

                    // We increase the number of ordinary invitations
                    await this.client.databases.add(`${member.guild.id}-${inviter.id}.regular`, 1)
                    // We save that this member invited this member
                    await this.client.databases.push(`${member.guild.id}-${inviter.id}.invitedUsers`, member.id)
                    if(inviter.id === member.id) {
                        await this.client.databases.add(`${member.guild.id}-${inviter.id}.fake`, 1)
                    }
                }

            }
        }
        let obj = {
            id: member.id,
            regular: 0,
            fake: 0,
            bonus: 0,
            leaves: 0,
            invitedUsersLeft: [
                "Value 0"
            ],
            invitedUsers: [],
            invited: {}
        }
        if(invite){
            obj.invited = {
                type: "normal",
                inviterID: inviter.id,
                inviteData: {
                    uses: invite.uses,
                    url: invite.url,
                    code: invite.code,
                    inviter: inviter.id,
                    invitedBy: inviter.username
                }
            }
            await this.client.dbmanager.createMember(member.guild, member, obj)
        } else if(oauth){
            obj.invited = {
                type: "oauth"
            }
            await this.client.dbmanager.createMember(member.guild, member, obj)
        } else if(vanity){
            obj.invited = {
                type: "vanity"
            }
            await this.client.dbmanager.createMember(member.guild, member, obj)
        } else {
            obj.invited = {
                type: "unkown"
            }
            await this.client.dbmanager.createMember(member.guild, member, obj)
        }
        let d
        if (inviter)
            d = await this.client.databases.get(`${member.guild.id}-${inviter.id}`)
        let channel = member.guild.channels.cache.get(guildData.joins.channel)
        let enabled = guildData.joins.enabled
        let string =  guildData.joins.message
        if (channel) {
            if(invite) {
                let formattedMessage = formatMessage(string, member, inviter, invite, d)
                channel.send(formattedMessage);
            } else if(vanity){
                channel.send(member.guild.language("misc:JOIN_VANITY", {
                    user: member.user.toString()
                }));
            } else if(oauth){
                channel.send(member.guild.language("misc:JOIN_OAUTH2", {
                    user: member.user.toString()
                }));
            } else if(perm){
                channel.send(member.guild.language("misc:JOIN_PERMISSIONS", {
                    user: member.user.toString()
                }));
            } else {
                channel.send(member.guild.language("misc:JOIN_UNKNOWN", {
                    user: member.user.toString()
                }));
            }
        }
    }
};