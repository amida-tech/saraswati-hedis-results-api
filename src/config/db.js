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
    return collection.replaceOne({ _id: measure.name }, measure, {
      upsert: true,
    });
  } catch (e) {
    console.log(e);
  }
};

const insertMeasures = (measures) => {
  return measures.map((measure) => insertMeasure(measure))
};

const getMeasures = () => {
  const collection = db.collection("measures");
  return collection.find({}).toArray();
};

//create collection for simulated hedis data
const insertSimulatedHedis = (simulated_data) => {
  const collection = db.collection ("simulated_data");
  try{
    return collection.findOneAndReplace({ }, simulated_data, {
      upsert: true,
    });
  } catch (e) {
    console.log(e);
  }
};

// insert predictions into the 'simulated_data' collection as a new document
const insertPredictions = (predictions) => {
  const collection = db.collection ("simulated_data");
  try{
    return collection.insert(predictions);
  } catch (e) {
    console.log(e);
  }
};

const getSimulatedHedis = () => {
  const collection = db.collection("simulated_data");
  return collection.find({}).toArray();
};


module.exports = { init, insertMeasure, insertMeasures, getMeasures, insertSimulatedHedis, insertPredictions, getSimulatedHedis };
