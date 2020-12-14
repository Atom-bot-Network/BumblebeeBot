const path = require("path"),
    {readdir} = require('fs'),
    i18n = require("../utils/i18n"),
    dbManager = require('../utils/dbmanager'),
    { Database } = require("quickmongo");
const {Client, Collection} = require("discord.js");
module.exports = class Bot extends Client {
    constructor(options) {
        super(options);
        this.config = require("../../config.js"); // Load the config file
        this.commands = new Collection(); // Creates new commands collection
        this.aliases = new Collection(); // Creates new command aliases collection
        this.logger = require('../utils/Logger') // Load the logger file
        this.dbmanager = new dbManager(this);
        this.databases = new Database(this.config.mongoDB);
        this.invitations = {};
        this.fetched = false;
        this.link = require('../utils/links')
    }
    async init() {
        this.commandLoader();
        this.eventLoader();
        this.login();
        this.processEvent();
        await this.databaseEvents();
        require("../utils/extenders")(this);
        this.translations = await i18n();

    }
    login() {
        return super.login(this.config.token)
    }
    processEvent() {
        process.on("unhandledRejection", err => {
            console.error("Uncaught Promise Error: ", err);
        });
    }
    async databaseEvents() {
        await this.databases.on("debug", console.log)
            .on("error", console.error)
            .on("ready", () => {
                this.logger.log(`Successfully connected to the ${data.name} database!`, "db");
            });
    }
    commandLoader() {
        readdir("./src/commands/", (err, content) => {
            if (err) console.log(err);
            if (content.length < 1) return console.log('Please create folder in "commands" folder.');
            let groups = [];
            content.forEach(element => {
                if (!element.includes('.')) groups.push(element); // If it's a folder
            });
            groups.forEach(folder => {
                readdir("./src/commands/" + folder, (e, files) => {
                    let js_files = files.filter(f => f.split(".").pop() === "js");
                    if (js_files.length < 1) return console.log('Please create files in "' + folder + '" folder.');
                    if (e) console.log(e);
                    js_files.forEach(element => {
                        const response = this.cmdLoad('../commands/' + folder, `${element}`);
                        if (response) this.logger.error(response);
                    });
                });
            });
        });
    }
    cmdLoad(commandPath, commandName) {
        try {
            const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
            this.logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
            props.conf.location = commandPath;
            if (props.init) {
                props.init(this);
            }
            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }
    //Event Loader by zechaos
    eventLoader() {
        readdir("./src/events", (err, files) => {
            if (!files) return;
            if (err) this.emit("error", err);
            for (const dir of files) {
                readdir(`./src/events/${dir}`, (err, file) => {
                    if (!file) return;
                    if (err) this.emit("error", err);
                    for (const evt of file) {
                        try {
                            if (!evt) return;
                            const event = new (require(`../events/${dir}/${evt}`))(this);
                            this.logger.log(`${evt} chargé`);
                            super.on(evt.split(".")[0], (...args) => event.run(...args));
                        } catch (e) {
                            this.emit("error", `${evt} n'a pas chargé ${e.stack}`)
                        }
                    }
                })
            }
        });
        return this
    }
    sortByKey(array, key) {
        return array.sort(function(a, b) {
            let x = a[key]; let y = b[key];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    }
    async resolveMember(search, guild){
        let member = null;
        if(!search || typeof search !== "string") return;
        // Try ID search
        if(search.match(/^<@!?(\d+)>$/)){
            let id = search.match(/^<@!?(\d+)>$/)[1];
            member = await guild.members.fetch(id).catch(() => {});
            if(member) return member;
        }
        // Try username search
        if(search.match(/^!?([^#]+)#(\d+)$/)){
            guild = await guild.fetch();
            member = guild.members.cache.find((m) => m.user.tag === search);
            if(member) return member;
        }
        member = await guild.members.fetch(search).catch(() => {});
        return member;
    }

    async resolveUser(search){
        let user = null;
        if(!search || typeof search !== "string") return;
        // Try ID search
        if(search.match(/^<@!?(\d+)>$/)){
            let id = search.match(/^<@!?(\d+)>$/)[1];
            user = this.users.fetch(id).catch((err) => {});
            if(user) return user;
        }
        // Try username search
        if(search.match(/^!?([^#]+)#(\d+)$/)){
            let username = search.match(/^!?([^#]+)#(\d+)$/)[0];
            let discriminator = search.match(/^!?([^#]+)#(\d+)$/)[1];
            user = this.users.cache.find((u) => u.username === username && u.discriminator === discriminator);
            if(user) return user;
        }
        user = await this.users.fetch(search).catch(() => {});
        return user;
    }
}