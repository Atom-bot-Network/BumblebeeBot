module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (oldMessage, newMessage) {
        if(!newMessage.editedAt) return;
        if (oldMessage === newMessage) return;
        this.client.emit("message", newMessage);
    }
};
