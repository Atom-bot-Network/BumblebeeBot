const Bumble = require('./base/Client'),
    client = new Bumble();
client.init().then(r => console.log(" "))
module.exports = client;



