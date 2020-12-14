const Command = require("../../base/Command.js")
module.exports = class Help extends Command {
    constructor (client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            permission: ["SEND_MESSAGES"],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
        });
    }
    async run (message, args, data) {
        if(args[0]){
            let cmd = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
            if (!cmd) return message.channel.send(message.language('${data.cmd.help.category}/${data.cmd.help.name}:COMMAND_NOT_FOUND'));
            if (cmd.conf.owner === true) return;
            let examples = message.language(cmd.help.example).replace(/[$_]/g,data.settings.prefix),
                usages = message.language(cmd.help.usage).replace(/[$_]/g,data.settings.prefix),
                description = message.language(cmd.help.description),
                group_embed = new this.client.MessageEmbed()
                    .setAuthor(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:HEADING`)+` `+cmd.help.name)
                    .addField(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:USAGES`), usages)
                    .addField(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:EXAMPLES`), examples)
                    .addField(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:GROUP`), cmd.help.category)
                    .addField(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:DESC`), description)
                    .addField(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:ALLIAS`), (cmd.conf.aliases.length > 0) ? cmd.conf.aliases.map((a) => "`"+a+"`").join("\n") : message.language(`${data.cmd.help.category}/${data.cmd.help.name}:NO_ALIASES`))
            if(cmd.conf.permission){
                group_embed.addField(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:PERMISSIONS`), `\`${cmd.conf.permission.join(", ")}\``);
            }
            if(!cmd.conf.enabled){
                group_embed.setDescription(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:DISABLED`));
            }
            if(cmd.conf.owner){
                group_embed.setDescription(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:OWNER_ONLY`));
            }
            return message.channel.send(group_embed);
        }
        let help_embed = new this.client.MessageEmbed()
            .setDescription(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:REMINDER`, {
                prefix: data.settings.prefix
            }))
        let commands_total = 0,
            categories = [];
        this.client.commands.forEach(cmd => {
            if (cmd.help.category !== "Developer") {
                if(!categories.includes(cmd.help.category)) categories.push(cmd.help.category);
            }
        });
        categories.forEach(cat => {
            let category = '',
                pos = 0,
                commands = this.client.commands.filter(cmd => cmd.help.category === cat);
            commands.forEach(cmd => {
                category += ' `'+cmd.help.name+'`';
                pos++
            });
            commands_total+=pos;
            help_embed.addField(cat+' - ('+pos+')', category.replace(/[' '_]/g,', ').substr(1));
        });
        let filter = this.client.commands.filter(cmd => cmd.help.category === "Developer").size,
            total = commands_total - filter;
        help_embed.setAuthor(message.language(`${data.cmd.help.category}/${data.cmd.help.name}:HEADING_2`, {
            total: total
        }));
        message.channel.send(help_embed);
    }
}