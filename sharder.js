const { ShardingManager } = require("discord.js");
const manager = new ShardingManager("./src/index.js", {
    token: require("./config").token,
    shardArgs: [ ...process.argv, ...[ '--sharded' ] ]
});
module.exports.manager = manager
console.log("Hello, "+require("os").userInfo().username+". Thanks for using BumblebeeBot");

manager.spawn();


