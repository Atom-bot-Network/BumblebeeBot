const Command = require("../../base/Command.js");
module.exports = class SetLeave extends Command {
    constructor(client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            permission: ["MANAGE_GUILD", "SEND_MESSAGES", "EMBED_LINKS"],
            botPermissions: [ "SEND_MESSAGES" ],
        });
    }
    async run(message, args, data) {
        if(data.settings.leaves.enabled){
            let leaves = {
                enabled: false,
                channel: false,
                message: false
            };
            await this.client.databases.set(`${message.guild.id}.leaves`, leaves);
            return message.channel.sendSuccess(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:DISABLED`, {
                prefix: data.settings.prefix
            }));
        } else {
            let leaves = {
                enabled: true,
                channel: "unknow",
                message: "unknow"
            };
            message.channel.send(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:INSTRUCTIONS1`));
            const filter = m => m.author.id === message.author.id;
            const collector = message.channel.createMessageCollector(filter, { time: 120000 });
            collector
                .on("collect",async msg => {
                    if (msg.content === "cancel") {
                        return collector.stop("cancel");
                    }
                    if(leaves.channel !== "unknow" && leaves.message === "unknow"){
                        if(msg.content.length < 1501){
                            leaves.message = msg.content;
                            await this.client.databases.set(`${message.guild.id}.leaves`, leaves);
                            collector.stop("success");
                        } else return message.channel.sendError(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:CARACT`));
                    }
                    if(leaves.channel === "unknow"){
                        let channel = msg.mentions.channels.first();
                        if(!channel) return collector.stop("unkownchan");
                        else leaves.channel = channel.id;
                        message.channel.sendSuccess(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:INSTRUCTIONS2`));
                    }
                })
                .on("end", (collected, reason) => {
                    switch (reason) {
                        case "time":
                            return message.channel.sendError(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:TIMEOUT`));
                        case "success":
                            return message.channel.sendSuccess(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:SUCCESS`, {
                                prefix: data.settings.prefix,
                                channel: leaves.channel
                            }));
                        case "cancel": {
                            return message.channel.sendSuccess(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:CANCEL`));
                        }
                        case "unkownchan":
                            return message.channel.sendError(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:CHANNEL`));
                    }
                });
        }
    }
}
