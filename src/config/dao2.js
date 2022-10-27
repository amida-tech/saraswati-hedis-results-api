/* eslint-disable no-underscore-dangle */
const { Client } = require('@elastic/elasticsearch')
const logger = require('winston');
const DOMPurify = require('dompurify');
const config = require('./config');

// const connectionUrl = `mongodb://${mongodb.host}:${mongodb.port}`;

let db;

const init = async () => {
  logger.info('Other Init');
  db = new Client({
    node: 'https://search-saraswati-h6d4vxmnqbp2n3rk23g6l4hvkq.us-east-2.es.amazonaws.com',
    auth: {
      username: config.dbUsername,
      password: config.dbPassword,
    },
  });
};

const initTest = (mockDb) => {
  logger.info('Other');
  db = mockDb;
};

const findMembers = async (query) => {
  logger.info('Other FindMembers');
  const result = await db.search({
    index: 'measure-results',
    query,
  });
  return result.body.hits.hits.map((hit) => hit._source);
  // const collection = db.collection('measures');
  // return collection.find(query).toArray();
};

const searchMembers = (query) => {
  logger.info('Other');
  /* const collection = db.collection('measures');
  // sanitize query
  const sanitizedQuery = DOMPurify.sanitize(query.memberId);
  return collection.find({ memberId: { $regex: sanitizedQuery.memberId, $options: 'i' } }).toArray(); */
  return [];
};

const findMeasureResults = (query) => {
  logger.info('Other');
  /* const collection = db.collection('measure_results');
  try {
    return collection.find(query).toArray();
  } catch (e) {
    logger.error(e);
    return e;
  } */
  return [];
};

const findPredictions = () => {
  logger.info('Other');
  return [];
  // const collection = db.collection('model_predictions');
  // return collection.find({}).toArray();
};

const findInfo = async (measure) => {
  logger.info('Other Info');
  const result = await db.search({
    index: 'hedis_info',
  });
  const list = result.body.hits.hits.map((hit) => hit._source);
  logger.info(list);
  return list;
  /* const collection = db.collection('hedis_info');
  if (measure) {
    return collection.find({ _id: new RegExp(`^${measure}`) }).toArray();
  }
  return collection.find({}).toArray(); */
};

const insertMember = async (member) => {
  logger.info('Other insert member');
  return false;
  /* const collection = db.collection('measures');
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
  } */
};

const insertMembers = (measures) => measures.map((measure) => insertMember(measure));

// create collection for results
const insertMeasureResults = (results) => {
  logger.info('Other insert measure');
  /* const collection = db.collection('measure_results');
  for (let i = 0; i < results.length; i += 1) {
    const resultObject = results[i];
    delete resultObject._id;

    const measurementType = resultObject.measure;
    let date;
    if (Object.prototype.toString.call(resultObject.date) === '[object Date]') {
      // eslint-disable-next-line prefer-destructuring
      date = resultObject.date.toISOString().split('T')[0];
    } else {
      // eslint-disable-next-line prefer-destructuring
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
  } */
  return true;
};

// create collection for predictions
const insertPredictions = (predictions) => {
  logger.info('Other insert predictions');
  /* const collection = db.collection('model_predictions');
  const predictionInsert = predictions;
  try {
    predictionInsert._id = predictionInsert.measure;
    return collection.findOneAndReplace({ measure: predictionInsert.measure }, predictionInsert, {
      upsert: true,
    });
  } catch (e) {
    logger.error(e);
    return e;
  } */

  return true;
};

// create collection for hedis info
const insertInfo = (info) => {
  logger.info('Other insert info');
  /* const collection = db.collection('hedis_info');
  try {
    return collection.insertMany(info, {
      upsert: true,
    });
  } catch (e) {
    logger.error(e);
    return e;
  } */
  return true;
};

const getPayors = () => {
  logger.info('Other get payers');
  return [];
  // const collection = db.collection('payors');
  // return collection.find({}).toArray();
};

const insertPayors = async (payor) => {
  logger.info('Other insert payers');
  /* const collection = db.collection('payors');
  const foundPayors = await collection.find({}).toArray();
  const filteredPayors = foundPayors.filter((payer) => payer.payor === payor.payor);
  if (filteredPayors.length < 1) {
    try {
      return await collection.insertMany([payor]);
    } catch (e) {
      logger.error(e);
      return e;
    }
  } */
  return false;
};

const getPractitioners = () => {
  logger.info('Other get practitioners');
  return [];
  // const collection = db.collection('practitioners');
  // return collection.find({}).toArray();
};

const insertPractitioner = async (practitioner) => {
  logger.info('Other insert practitioners');
  /* const collection = db.collection('practitioners');
  const foundPayors = await collection.find({}).toArray();
  const filteredPayors = foundPayors
    .filter((prac) => prac.practitioner === practitioner.practitioner);
  if (filteredPayors.length < 1) {
    try {
      return await collection.insertMany([practitioner]);
    } catch (e) {
      logger.error(e);
      return e;
    }
  } */
  return false;
};

const getHealthcareProviders = () => {
  logger.info('Other get HCP');
  return [];
  // const collection = db.collection('healthcareProviders');
  // return collection.find({}).toArray();
};

const insertHealthcareProviders = async (provider) => {
  logger.info('Other insert HCP');
  /* const collection = db.collection('healthcareProviders');
  const foundHCProvider = await collection.find({}).toArray();
  const filteredHCProvider = foundHCProvider.filter((prov) => prov.provider === provider.provider);
  if (filteredHCProvider.length < 1) {
    try {
      return await collection.insertMany([provider]);
    } catch (e) {
      logger.error(e);
      return e;
    }
  } */
  return false;
};

const getHealthcareCoverages = () => {
  logger.info('Other get cov');
  return [];
  // const collection = db.collection('healthcareCoverage');
  // return collection.find({}).toArray();
};

const insertHealthcareCoverage = async (coverage) => {
  logger.info('Other insert cov');
  /* const collection = db.collection('healthcareCoverage');
  const foundHCCoverage = await collection.find({}).toArray();
  const filteredHCCoverage = foundHCCoverage
    .filter((cover) => cover.coverage === coverage.coverage);
  if (filteredHCCoverage.length < 1) {
    try {
      return await collection.insertMany([coverage]);
    } catch (e) {
      logger.error(e);
      return e;
    }
  } */
  return false;
};

module.exports = {
  init,
  initTest,
  findMembers,
  searchMembers,
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
