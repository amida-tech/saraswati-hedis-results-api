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

const findMembers = (query) => {
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

const insertMember = async (member) => {
  const collection = db.collection('measures');
  try {
    const countOfRecords = await collection.countDocuments({ memberId: member.memberId });
    const recordId = `${member.memberId}-${member.measurementType}-${countOfRecords}`;
    logger.info(`Upserting new record with Id: ${recordId}`);
    return collection.replaceOne({ _id: recordId }, member, {
      upsert: true,
    });
  } catch (e) {
    logger.error(e);
    return e;
  }
};

const insertMembers = (measures) => measures.map((measure) => insertMember(measure));

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

const getPayors = () => {
  const collection = db.collection('payors');
  return collection.find({}).toArray();
};

const insertPayors = async (payor) => {
  const collection = db.collection('payors');
  const foundPayors = await collection.find({}).toArray();
  const filteredPayors = foundPayors.filter((payer) => payer.payor === payor.payor);
  if (filteredPayors.length < 1) {
    try {
      return await collection.insertMany([payor]);
    } catch (e) {
      logger.error(e);
      return e;
    }
  }
};
const getPractitioners = () => {
  const collection = db.collection('practitioners');
  return collection.find({}).toArray();
};
const insertPractitioner = async (practitioner) => {
  const collection = db.collection('practitioners');
  const foundPayors = await collection.find({}).toArray();
  const filteredPayors = foundPayors.filter((prac) => prac.practitioner === practitioner.practitioner);
  if (filteredPayors.length < 1) {
    try {
      return await collection.insertMany([practitioner]);
    } catch (e) {
      logger.error(e);
      return e;
    }
  }
};
const getHealthcareProviders = () => {
  const collection = db.collection('healthcareProviders');
  return collection.find({}).toArray();
};
const insertHealthcareProviders = async (provider) => {
  const collection = db.collection('healthcareProviders');
  const foundHCProvider = await collection.find({}).toArray();
  const filteredHCProvider = foundHCProvider.filter((prov) => prov.provider === provider.provider);
  if (filteredHCProvider.length < 1) {
    try {
      return await collection.insertMany([provider]);
    } catch (e) {
      logger.error(e);
      return e;
    }
  }
};
const getHealthcareCoverages = () => {
  const collection = db.collection('healthcareCoverage');
  return collection.find({}).toArray();
};
const insertHealthcareCoverage = async (coverage) => {
  const collection = db.collection('healthcareCoverage');
  const foundHCCoverage = await collection.find({}).toArray();
  const filteredHCCoverage = foundHCCoverage.filter((cover) => cover.coverage === coverage.coverage);
  if (filteredHCCoverage.length < 1) {
    try {
      return await collection.insertMany([coverage]);
    } catch (e) {
      logger.error(e);
      return e;
    }
  }
};
module.exports = {
  init,
  initTest,
  findMembers,
  findMeasureResults,
  findPredictions,
  findInfo,
  insertMember,
  insertMembers,
  insertMeasureResults,
  insertPredictions,
  insertInfo,
  getPayors,
  insertPayors,
  getPractitioners,
  insertPractitioner,
  getHealthcareProviders,
  insertHealthcareProviders,
  getHealthcareCoverages,
  insertHealthcareCoverage,
};
