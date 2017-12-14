module.exports = {
    Update: function Update(pcollection, id, set, callback) {
        var mongodb = require('mongodb');
        var MongoClient = mongodb.MongoClient;
        var url = 'mongodb://juliobricenoro:juliobricenoro@ds229465.mlab.com:29465/proenfar';
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Tremendo Error update!!!!');
            }
            else {
                var collection = db.collection(pcollection);
                var o_id = new mongodb.ObjectID(id);
                collection.update({ "_id": o_id }, { $set: set }, function (err, result) {
                    if (err) {
                        console.log('Tremenda ERROR compadre update');
                    }
                    else {
                        return callback('Ok');
                    }
                });
                db.close();
            }
        });
    },
    UpdateCriteria: function Update(pcollection, criteria, set, callback) {
        var mongodb = require('mongodb');
        var MongoClient = mongodb.MongoClient;
        var url = 'mongodb://juliobricenoro:juliobricenoro@ds229465.mlab.com:29465/proenfar';
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Tremendo Error criteria!!!!');
            }
            else {
                var collection = db.collection(pcollection);
                collection.update(criteria, { $set: set }, function (err, result) {
                    if (err) {
                        console.log('Tremenda ERROR compadre criteria');
                    }
                    else {
                        var collection = db.collection('Log');
                        var dataInsert = set;
                        collection.insert(dataInsert, function (err, result) {
                            if (err) {
                                console.log('Tremenda ERROR compadre criteria1');
                            }
                            else {
                                callback('Ok');
                                console.log('Tpor aqui!!!!');
                            }
                            db.close();
                        });
                    }
                });
            }
        });
    },
    Find: function Find(pcollection, filter, callback)
    {
        var mongodb = require('mongodb');
        var MongoClient = mongodb.MongoClient;
        var url = 'mongodb://juliobricenoro:juliobricenoro@ds229465.mlab.com:29465/proenfar'; // Despu�s de la URL (Fija con puerto por defecto Mongo) viene la BD
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Tremendo Error find!!!!');
            }
            else {
                var collection = db.collection(pcollection);
                collection.find(filter).toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else if (result.length) {
                        console.log('Found:', result);
                        callback(result);
                    } else {
                        callback([]);
                        console.log('No document(s) found with defined "find" criteria!');
                    }
                    db.close();
                });
            }
        });
    },
    Insert: function Insert(pcollection, dataInsert, callback) {
        var mongodb = require('mongodb');
        var MongoClient = mongodb.MongoClient;
        var url = 'mongodb://juliobricenoro:juliobricenoro@ds229465.mlab.com:29465/proenfar'; // Despu�s de la URL (Fija con puerto por defecto Mongo) viene la BD
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Tremendo Error Insert!!!!');
            }
            else {
                var collection = db.collection(pcollection);
                collection.insert(dataInsert, function (err, result) {
                    if (err) {
                        console.log('Tremenda ERROR compadre Insert');
                    }
                    else {
                        callback('Ok');
                    }
                    db.close();
                });
            }
        });
    },
    Remove: function Remove(pcollection, criteria, callback) {
        var mongodb = require('mongodb');
        var MongoClient = mongodb.MongoClient;
        var url = 'mongodb://juliobricenoro:juliobricenoro@ds229465.mlab.com:29465/proenfar'; // Despu�s de la URL (Fija con puerto por defecto Mongo) viene la BD
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Tremendo Error remove!!!!');
            }
            else {
                var collection = db.collection(pcollection);
                collection.remove(criteria, function (err, result) {
                    if (err) {
                        console.log('Tremenda ELIMINACION compadre remove');
                    }
                    else {
                        callback('Ok');
                    }
                    db.close();
                });
            }
        });
    },
    Aggregate: function Aggregate(pcollection, aggregatequery, callback) {
        var mongodb = require('mongodb');
        var MongoClient = mongodb.MongoClient;
        //var url = 'mongodb://juliobricenoro:juliobricenoro@ds229465.mlab.com:29465/proenfar';; // Despu�s de la URL (Fija con puerto por defecto Mongo) viene la BD
        var url = 'mongodb://juliobricenoro:juliobricenoro@ds229465.mlab.com:29465/proenfar'; // Despu�s de la URL (Fija con puerto por defecto Mongo) viene la BD
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Tremendo Error aggregate!!!!');
            }
            else {
                var collection = db.collection(pcollection);
                collection.aggregate(aggregatequery).toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else if (result.length) {
                        console.log('Found:', result);
                        callback(result);
                    } else {
                        callback([]);
                        console.log('No document(s) found with defined "find" criteria!');
                    }
                    db.close();
                });
            }
        });
    }
}