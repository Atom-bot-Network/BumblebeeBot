const Command = require("../../base/Command.js");
module.exports = class SetJoin extends Command {
    constructor(client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            permission: ["MANAGE_GUILD", "SEND_MESSAGES", "EMBED_LINKS"],
            botPermissions: [ "SEND_MESSAGES" ],
        });
    }
    async run(message, args, data) {
        if(data.settings.joins.enabled){
            let joins = {
                enabled: false,
                channel: false,
                message: false
            };
            await this.client.databases.set(`${message.guild.id}.joins`, joins);
            return message.channel.sendSuccess(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:DISABLED`, {
                prefix: data.settings.prefix
            }));
        } else {
            let joins = {
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
                    if(joins.channel !== "unknow" && joins.message === "unknow"){
                        if(msg.content.length < 1501){
                            joins.message = msg.content;
                            await this.client.databases.set(`${message.guild.id}.joins`, joins);
                            collector.stop("success");
                        } else return message.channel.sendError(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:CARACT`));
                    }
                    if(joins.channel === "unknow"){
                        let channel = msg.mentions.channels.first();
                        if(!channel) return collector.stop("unkownchan");
                        else joins.channel = channel.id;
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
                                channel: joins.channel
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
