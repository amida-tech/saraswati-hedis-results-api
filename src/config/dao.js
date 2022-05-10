/* eslint-disable no-underscore-dangle */
const { MongoClient } = require('mongodb');
const { mongodb } = require('./config');
const logger = require('./winston');

const connectionUrl = `mongodb://${mongodb.host}:${mongodb.port}`;

let db;

const init = async () => {
  const client = await MongoClient.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = client.db(mongodb.name);
};

const initTest = (mockDb) => {
  db = mockDb;
};

const findMeasures = (query) => {
  const collection = db.collection('measures');
  return collection.find(query).toArray();
};

const findMeasureResults = (query) => {
  const collection = db.collection('measure_results');
  try {
    return collection.find(query).toArray();
  } catch (e) {
    logger.error(e);
    return e;
  }
};

const findPredictions = () => {
  const collection = db.collection('model_predictions');
  return collection.find({}).toArray();
};

const findInfo = (measure) => {
  const collection = db.collection('hedis_info');
  if (measure) {
    return collection.find({ _id: new RegExp(`^${measure}`) }).toArray();
  }
  return collection.find({}).toArray();
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
    logger.error(e);
    return e;
  }
};

const insertMeasures = (measures) => measures.map((measure) => insertMeasure(measure));

// create collection for results
const insertMeasureResults = (results) => {
  const collection = db.collection('measure_results');
  for (let i = 0; i < results.length; i += 1) {
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
    if (resultObject.subScores) {
      for (let j = 0; j < resultObject.subScores.length; j += 1) {
        resultObject.subScores[j].date = resultObject.date;
      }
    }

    try {
      collection.findOneAndReplace(
        { _id: resultObject._id },
        resultObject,
        { upsert: true },
      );
    } catch (e) {
      logger.error(e);
      return false;
    }
  }
  return true;
};

// create collection for predictions
const insertPredictions = (predictions) => {
  const collection = db.collection('model_predictions');
  const predictionInsert = predictions;
  try {
    predictionInsert._id = predictionInsert.measure;
    return collection.findOneAndReplace({ measure: predictionInsert.measure }, predictionInsert, {
      upsert: true,
    });
  } catch (e) {
    logger.error(e);
    return e;
  }
};

// create collection for hedis info
const insertInfo = (info) => {
  const collection = db.collection('hedis_info');
  try {
    return collection.insertMany(info, {
      upsert: true,
    });
  } catch (e) {
    logger.error(e);
    return e;
  }
};

module.exports = {
  init,
  initTest,
  findMeasures,
  findMeasureResults,
  findPredictions,
  findInfo,
  insertMeasure,
  insertMeasures,
  insertMeasureResults,
  insertPredictions,
  insertInfo,
};
