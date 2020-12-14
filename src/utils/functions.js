const moment = require('moment')
/**
 * Compare two arrays
 * @param {Array} value The first array
 * @param {Array} other The second array
 * @returns {Boolean} Whether the arrays are equals
 */
const isEqual = (value, other) => {
    let type = Object.prototype.toString.call(value);
    if (type !== Object.prototype.toString.call(other)) return false;
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
    let valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    let otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;
    const compare = (item1, item2) => {
        let itemType = Object.prototype.toString.call(item1);
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }
        else {
            if (itemType !== Object.prototype.toString.call(item2)) return false;
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }
        }
    };
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }
    return true;
};

/**
 * @param {string} message The message to format
 * @param {object} member The member who joined/has left
 * @param {object} inviter The user who invite the member
 * @param {object} invite The used invite informations
 * @param {object} inviterData The mongoose document of the inviter
 * @returns {string} The formatted string
 */
const formatMessage = (message, member, inviter, invite,  inviterData) => {
    return message
        .replace(/{user}/g, member.toString())
        .replace(/{user.name}/g, member.user.username)
        .replace(/{user.tag}/g, member.user.tag)
        .replace(/{user.id}/g, member.user.id)
        .replace(/{guild}/g, member.guild.name)
        .replace(/{guild.count}/g, member.guild.memberCount)
        .replace(/{inviter}/g, inviter.toString())
        .replace(/{user.createdat}/g, moment(member.user.createdAt, "YYYYMMDD").fromNow())
        .replace(/{inviter.tag}/g, inviter.tag)
        .replace(/{inviter.name}/g, inviter.username)
        .replace(/{inviter.id}/g, inviter.id)
        .replace(/{inviter.invites}/g, inviterData.regular + inviterData.bonus - inviterData.fake - inviterData.leaves)
        .replace(/{invite.code}/g, invite.code)
        .replace(/{invite.uses}/g, invite.uses)
        .replace(/{invite.url}/g, invite.url);
};
module.exports = {
    isEqual,
    formatMessage
}