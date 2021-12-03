import 'regenerator-runtime/runtime';

const { MongoClient } = require('mongodb');
const { mongodb } = require('./config');

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
  const collection = db.collection('measures');
  try {
    return collection.replaceOne({ _id: measure.name }, measure, {
      upsert: true,
    });
  } catch (e) {
    console.log(e);
  }
};

const insertMeasures = (measures) => {
  return measures.map((measure) => insertMeasure(measure));
};

const getMeasures = () => {
  const collection = db.collection('measures');
  return collection.find({}).toArray();
};

//create collection for simulated hedis data
const insertSimulatedHedis = (simulated_data) => {
  const collection = db.collection('simulated_data');
  try {
    return collection.findOneAndReplace({ }, simulated_data, {
      upsert: true,
    });
  } catch (e) {
    console.log(e);
  }
};

const getSimulatedHedis = () => {
  const collection = db.collection('simulated_data');
  return collection.find({}).toArray();
};

//create collection for predictions
const insertPredictions = (predictions) => {
  const collection = db.collection('model_predictions');
  try {
    return collection.findOneAndReplace({ }, predictions, {
      upsert: true,
    });
  } catch (e) {
    console.log(e);
  }
};

const getPredictions = () => {
  const collection = db.collection('model_predictions');
  return collection.find({}).toArray();
};

module.exports = { init, insertMeasure, insertMeasures, getMeasures, insertSimulatedHedis, getSimulatedHedis, insertPredictions, getPredictions };
