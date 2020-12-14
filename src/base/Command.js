const path = require('path')
class Command {
  constructor(client, {
    dirname = false,
    filename = false,
    enabled = true,
    guildOnly = true,
    aliases = [],
    permission = [],
    botPermissions = [],
    owner = false,
    cooldown= 2000,
    premium = false
  }) {
    let name = 'Unkown';
    if (filename) {
      name = filename.split(path.sep)[filename.split(path.sep).length - 1].replace('.js', "").toLowerCase()
    }
    let category = 'Other';
    if (dirname) {
      category = dirname.split(path.sep)[dirname.split(path.sep).length - 1]
    }
    let description = `${category.toLowerCase()}/${name.toLowerCase()}:DESCRIPTION`;
    let usage = `${category.toLowerCase()}/${name.toLowerCase()}:USAGE`;
    let example = `${category.toLowerCase()}/${name.toLowerCase()}:EXAMPLE`;
    this.client = client;
    this.conf = {enabled, guildOnly, aliases, permission, botPermissions, owner, cooldown, premium};
    this.help = {name, category, description, usage, example};
  }
}
module.exports = Command;
  