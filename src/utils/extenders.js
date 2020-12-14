const { Guild, Message, MessageEmbed, Channel } = require("discord.js"),
    config = require("../../config");
module.exports = client => {
    Array.prototype.asyncForEach = async function(callback) {
        for (let index = 0; index < this.length; index++) {
            await callback(this[index], index, this);
        }
    }
    String.prototype.toCapitalize = function() {
        return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
        //"text".toCapitalize = "Text"
    };
    Guild.prototype.language = function(key, args) {
        let language = this.client.translations.get(
            this.data.lang ? this.data.lang : config.default_language
        );
        if (!language) {
            language =  this.client.translations.get(config.default_language);
        }
        if (!language) throw "Message: Invalid language set in data.";
        return language(key, args);
    };
    Message.prototype.language = function(key, args) {
        let language = this.client.translations.get(
            this.guild.data.lang ? this.guild.data.lang : config.default_language
        );
        if (!language) {
            language = this.client.translations.get(config.default_language);
        }
        if (!language) throw "Message: Invalid language set in data.";
        return language(key, args);
    };
    Channel.prototype.language = function(key, args) {
        let language = this.client.translations.get(
            this.guild.data.lang ? this.guild.data.lang : config.default_language
        );
        if (!language) {
            language = this.client.translations.get(config.default_language);
        }
        if (!language) throw "Message: Invalid language set in data.";
        return language(key, args);
    };
    Channel.prototype.sendError = function(args) {
        this.send(`${config.emoji.error} | ${args}`)
    }
    Channel.prototype.sendSuccess = function(args) {
        this.send(`${config.emoji.success} | ${args}`)
    }
    Channel.prototype.sendWarn = function(args) {
        this.send(`${config.emoji.warn} | ${args}`)
    }
    client.MessageEmbed = class Embed extends MessageEmbed {
        constructor(options) {
            super(options);
            this.setFooter(config.embed.footer, client.user.displayAvatarURL({format: "png", size: 1024}));
            this.setColor(config.embed.color);
            this.setTimestamp();
        }
    }
}
