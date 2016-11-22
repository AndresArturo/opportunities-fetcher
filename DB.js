var MongoClient = require("mongodb").MongoClient;
var config = require("./config");


// Attributes
var opps = null;
var db = null;

function connect(callback) {
    if (!db)
        MongoClient.connect(config.getDBConnectionString(), function(err, database) {
            if (!err) {
                db = database;
                opps = db.collection(config.getCollectionName());
                callback();
            } else
                callback(err);
        });
    else
        callback();
}



function getOpps(callback) {
    connect((err) => {
        if (err)
            callback(err);
        else
            opps.find({}).toArray(callback);
    });
}

function saveOpps(newOpps, callback) {
    connect((err) => {
        if (err)
            callback(err);
        else
            opps.insertMany(newOpps, callback);
    });
}

function closeDB() {
    if (db) {
        db.close();
        db = null;
    }
}


module.exports = {
    "getOpps": getOpps,
    "saveOpps": saveOpps,
    "close": closeDB
};