/* eslint-disable no-underscore-dangle */
const { Client } = require('@elastic/elasticsearch');
const logger = require('winston');
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
  let result = [];
  if (query) {
    result = await db.search({
      index: 'measure-results',
      body: {
        query: {
          match: {
            measurementType: {
              query: query.measurementType,
            },
          },
        },
      },
    });
  } else {
    result = await db.search({
      index: 'measure-results',
    });
  }
  return result.body.hits.hits.map((hit) => hit._source);
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
  logger.info('Find Measure Results not supported');
  return [];
};

const findPredictions = () => {
  logger.info('Find Predicitions not supported');
  return [];
};

const findInfo = async (measure) => {
  logger.info('Other Info');
  let result = [];
  if (measure) {
    result = await db.search({
      index: 'hedis_info',
      body: {
        query: {
          match: {
            measureId: {
              query: measure,
            },
          },
        },
      },
    });
  } else {
    result = await db.search({
      index: 'hedis_info',
    });
  }

  const list = result.body.hits.hits.map((hit) => hit._source);
  return list;
};

const insertMember = async (member) => {
  logger.info('Other insert member');
  await db.index({
    index: 'measures',
    type: '_doc',
    body: member,
  });
  return true;
};

const insertMembers = async (measures) => {
  const body = [];
  measures.forEach((element) => {
    body.push({ index: { _index: 'measures' } });
    body.push(element);
  });
  logger.info('Other insert info');
  await db.bulk({ body });
  return true;
};

// create collection for results
const insertMeasureResults = (results) => {
  logger.info('This function is not supported');
  return true;
};

// create collection for predictions
const insertPredictions = (predictions) => {
  logger.info('This function is not yet supported');

  return true;
};

// create collection for hedis info
const insertInfo = async (info) => {
  const body = [];
  info.forEach((element) => {
    body.push({ index: { _index: 'hedis_info' } });
    body.push(element);
  });
  logger.info('Other insert info');
  await db.bulk({ body });
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
