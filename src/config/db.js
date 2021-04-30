const { MongoClient } = require("mongodb");
const { mongodb } = require("./config");
const connectionUrl = `mongodb://${mongodb.host}:${mongodb.port}`;

let db;

const init = async () => {
  const client = await MongoClient.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = client.db(mongodb.name);
};

const insertMeasure = (measure) => {
  const collection = db.collection("measures");
  try {
    return collection.replaceOne({ _id: measure.displayName }, measure, {
      upsert: true,
    });
  } catch (e) {
    console.log(e);
  }
};

const insertMeasures = (measures) => {
  const collection = db.collection("measures");
  return collection.insertMany(measures);
};

const getMeasures = () => {
  const collection = db.collection("measures");
  return collection.find({}).toArray();
};

module.exports = { init, insertMeasure, insertMeasures, getMeasures };
