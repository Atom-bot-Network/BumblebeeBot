const {Guild, Member} = require("discord.js")
class DatabaseManager{
    constructor(client){
        this.client = client
    }
    /**
     * @param {Guild} guild
     */
    createGuild = async guild => {
        return this.client.databases.set(guild.id, {
            id: guild.id,
            lang: this.client.config.default_language,
            prefix: this.client.config.prefix,
            joins: {
                enabled: false,
                channel: false,
                message: false
            },
            leaves: {
                enabled: false,
                channel: false,
                message: false
            },
            premium: false,
            partner: false
        }).then(this.client.logger.log(`Guild ${guild.name} with ID ${guild.id} created with success`, "db"))
    };
    /**
     * @param {Guild} guild
     */
    getGuild = async guild => {
        return this.client.databases.get(guild.id).then(this.client.logger.log(`Data of Guild ${guild.name} with ID ${guild.id} get with success`, "db"))
    };
    /**
     * @param {Guild} guild
     */
    removeGuild = async guild => {
        return this.client.databases.delete(guild.id).then(this.client.logger.log(`Guild ${guild.name} with ID ${guild.id} deleted with success`, "db"))
    };



    /**
     * @param {Member} member
     */
    createUser = async member => {
        return this.client.databases.set(member.id, {
            id: member.id,
            premium: false,
            partner: false,
            staff: false,
            bug: false,
            developer: false
        }).then(this.client.logger.log(`User ${member.username} with ID ${member.id} created with success`, "db"))
    };
    /**
     * @param {Member} member
     */
    getUser = async member => {
        return this.client.databases.get(member.id).then(this.client.logger.log(`Data of User ${member.username} with ID ${member.id} get with success`, "db"))
    };
    /**
     * @param {Member} member
     */
    removeUser = async member => {
        return this.client.databases.delete(member.id).then(this.client.logger.log(`User ${member.username} with ID ${member.id} deleted with success`, "db"))
    };

    /**
     * @param {Guild} guild
     * @param {Member} member
     * @param {Object} object
     */
    createMember = async  (guild, member, object)  => {
        return this.client.databases.set(`${guild.id}-${member.id}`, object).then(this.client.logger.log(`Member ${member.username} with ID ${member.id} created with success`, "db"))
    };
    /**
     * @param {Guild} guild
     * @param {GuildMember} member
     */
    createUnkownMember = async  (guild, member)  => {
        return this.client.databases.set(`${guild.id}-${member.id}`, {
            id: member.id,
            regular: 0,
            fake: 0,
            bonus: 0,
            leaves: 0,
            invitedUsersLeft: [
                "Value 0"
            ],
            invitedUsers: [],
            invited: {
                type: "unkown"
            }
        }).then(this.client.logger.log(`Member ${member.username} with ID ${member.id} created with success`, "db"))
    };

    /**
     * @param {Guild} guild
     * @param {Member} member
     */
    getMember = async  (guild, member)  => {
        return this.client.databases.get(`${guild.id}-${member.id}`).then(this.client.logger.log(`Data of Member ${member.username} with ID ${member.id} get with success`, "db"))
    };
    /**
     * @param {Guild} guild
     * @param {Member} member
     */
    removeMember = async (guild, member) => {
        return this.client.databases.delete(`${guild.id}-${member.id}`).then(this.client.logger.log(`Member ${member.username} with ID ${member.id} deleted with success`, "db"))
    };
    /**
     * @param {Guild} guild
     * @param {Member} member
     * @param {String} id
     */
    removeInvitedUserLeft = async (guild, member, id) => {
        let data = await this.client.databases.get(`${guild.id}-${member.id}.invitedUsersLeft`).then(async d => {
            console.log(d)
            return d.filter(x => x !== id)
        })
        return await this.client.databases.set(`${guild.id}-${member.id}.invitedUsersLeft`, data)
    }
    /**
     * @param {Guild} guild
     * @param {Member} member
     * @param {String} id
     */
    removeInvitedUser = async (guild, member, id) => {
        let data = await this.client.databases.get(`${guild.id}-${member.id}.invitedUsers`).then(async d => {
            console.log(d)
            return d.filter(x => x !== id)
        })
        return await this.client.databases.set(`${guild.id}-${member.id}.invitedUsers`, data)
    }
}
module.exports = DatabaseManager
