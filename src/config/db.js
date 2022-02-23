const { MongoClient } = require('mongodb');
const { mongodb } = require('./config');
const logger = require('./winston');

const connectionUrl = `mongodb://${mongodb.host}:${mongodb.port}`;

let db;

const initTest = (mockDb) => {
  db = mockDb;
};

const init = async () => {
  const client = await MongoClient.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = client.db(mongodb.name);
};

const insertMeasure = async (measure) => {
  const collection = db.collection('measures');
  try {
    const countOfRecords = await collection.countDocuments({ memberId: measure.memberId });
    const recordId = `${measure.memberId}-${measure.measurementType}-${countOfRecords}`;
    logger.info(`Upserting new record with Id: ${recordId}`);
    return collection.replaceOne({ _id: recordId }, measure, {
      upsert: true,
    });
  } catch (e) {
    console.log(e);
  }
};

const insertMeasures = (measures) => measures.map((measure) => insertMeasure(measure));

const getMeasures = () => {
  const collection = db.collection('measures');
  return collection.find({}).toArray();
};

const searchMeasures = (query) => {
  const collection = db.collection('measure_results');
  try {
    return collection.find(query).toArray();
  } catch (e) {
    logger.error(e);
  }
};

// create collection for simulated hedis data
const insertSimulatedHedis = (simulated_data) => {
  const collection = db.collection('simulated_data');
  try {
    return collection.findOneAndReplace({ }, simulated_data, {
      upsert: true,
    });
  } catch (e) {
    logger.error(e);
  }
};

const getSimulatedHedis = () => {
  const collection = db.collection('simulated_data');
  return collection.find({}).toArray();
};

// create collection for predictions
const insertPredictions = (predictions) => {
  const collection = db.collection('model_predictions');
  try {
    return collection.findOneAndReplace({ }, predictions, {
      upsert: true,
    });
  } catch (e) {
    logger.error(e);
  }
};

const getPredictions = () => {
  const collection = db.collection('model_predictions');
  return collection.find({}).toArray();
};

const getPredictionData = (params) => {
  const collection = db.collection('measure_results');
  return collection.find(params).toArray();
};

// create collection for results
const insertResults = (results) => {
  const collection = db.collection('measure_results');
  for (let i = 0; i < results.length; i++) {
    const resultObject = results[i];
    delete resultObject._id;

    const measurementType = resultObject.measure;
    let date;
    if (Object.prototype.toString.call(resultObject.date) === '[object Date]') {
      date = resultObject.date.toISOString().split('T')[0];
    } else {
      date = resultObject.date.split('T')[0];
      resultObject.date = new Date(date);
    }

    resultObject._id = `${measurementType}-${date}`;
    for (const subDate in resultObject.subScores) {
      subDate.date = resultObject.date;
    }
    try {
      collection.findOneAndReplace(
        { _id: resultObject._id },
        resultObject,
        { upsert: true },
      );
    } catch (e) {
      logger.error(e);
    }
  }
};

module.exports = {
  init, insertMeasure, insertMeasures, getMeasures, insertSimulatedHedis, getSimulatedHedis, insertPredictions, getPredictions, getPredictionData, initTest, searchMeasures, insertResults,
};
