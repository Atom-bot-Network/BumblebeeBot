module.exports = class {
    constructor(client) {
        this.client = client;
    }
    async run() {
        let client = this.client
        let guildsCounts = await this.client.shard.fetchClientValues("guilds.cache.size");
        let guildsCount = guildsCounts.reduce((p, count) => p+count);
        let v = await this.client.shard.broadcastEval((client) =>{
            let size = 0
            let arr = this.guilds.cache.array()
            arr.asyncForEach(async g => { size = size + client.invitations[g.id].size})
            return size
        })
        let cnt = v.reduce((a,b) => a+b)
        const status = require("../../../config.js").status;
        let i = 0;
        setInterval(function(){
            client.user.setActivity(status[parseInt(i, 10)].name.replace("{serversCount}", guildsCount).replace("{inviteCount}", cnt), {type: status[parseInt(i, 10)].type});
            if(status[parseInt(i+1, 10)]){
                i++;
            } else {
                i = 0;
            }
        }, 20000);
    }
}