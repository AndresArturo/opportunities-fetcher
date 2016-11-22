var emailConf = require("./emailConfig");
var dbConfig = require("./dbConfig");

module.exports = {
    getSender: function() {
        return emailConf.from || "";
    },

    getRecipient: function() {
        return emailConf.to || "";
    },

    getDBConnectionString: function() {
        return `mongodb://${process.env.UNAME}:${process.env.UPASS}@${dbConfig.hostname}:${dbConfig.port}/${dbConfig.database}`;
    },

    getCollectionName: function() {
        return dbConfig.collection || "collection";
    }
}