const { MongoClient } = require('mongodb');

const connectionUrl = 'mongodb://localhost:27017';
const dbName = 'hedisdb';

let db;

const init = () =>
  MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then((client) => {
    console.log("DB connected!")
    db = client.db(dbName);
    // db.collection("measures").drop(function(err, delOK) {
    //   if (err) throw err;
    //   if (delOK) console.log("Collection deleted");
    // });
  });

const insertMeasure = (measure) => {
  const collection = db.collection('measures')
  return collection.insertOne(measure)
}

const insertMeasures = (measures) => {
  const collection = db.collection('measures');
  return collection.insertMany(measures)
}

const getMeasures = () => {
  const collection = db.collection('measures')
  return collection.find({}).toArray()
}

module.exports = { init, insertMeasure, insertMeasures, getMeasures }