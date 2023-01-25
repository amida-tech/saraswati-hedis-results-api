/* eslint-disable no-underscore-dangle */
const { Client } = require('@elastic/elasticsearch');
const logger = require('winston');
const config = require('./config');

// const connectionUrl = `mongodb://${mongodb.host}:${mongodb.port}`;

let db;

const init = async () => {
  db = new Client({
    node: 'https://search-saraswati-h6d4vxmnqbp2n3rk23g6l4hvkq.us-east-2.es.amazonaws.com',
    auth: {
      username: config.dbUsername,
      password: config.dbPassword,
    },
  });
};

const initTest = (mockDb) => {
  db = mockDb;
};

const extractResults = (results) => results.body.hits.hits.map((hit) => hit._source);

const findMembers = async (query) => {
  let result = [];
  if (query && Object.keys(query).length !== 0) {
    result = await db.search({
      index: 'measures',
      size: 10000,
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
      index: 'measures',
      size: 10000,
    });
  }
  return extractResults(result);
};

const searchMembers = (query) => {
  logger.info('Other');
  logger.info(query);
  /* const collection = db.collection('measures');
  // sanitize query
  const sanitizedQuery = DOMPurify.sanitize(query.memberId);
  return collection.find({ memberId: { $regex: sanitizedQuery.memberId, $options: 'i' } }).toArray(); */
  return [];
};

const findMeasureResults = (query) => {
  logger.info('findMeasureResults not supported');
  return [];
};

const findPredictions = () => {
  logger.info('findPredictions not supported');
  return [];
};

const findInfo = async (measure) => {
  let result = [];
  if (measure) {
    result = await db.search({
      index: 'hedis_info',
      body: {
        size: 100,
        query: {
          match: {
            measureId: {
              query: measure,
            },
          },
        },
        sort: [
          {
            measureId: {
              order: 'desc',
            },
          },
        ],
      },
    });
  } else {
    result = await db.search({
      index: 'hedis_info',
      body: {
        size: 100,
      },
    });
  }

  return extractResults(result);
};

const insertMember = async (member) => {
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
  await db.bulk({ body });
  return true;
};

// create collection for results
const insertMeasureResults = (results) => {
  logger.info('insertMeasureResults is not supported');
  return true;
};

// create collection for predictions
const insertPredictions = (predictions) => {
  logger.info('insertPredictions is not yet supported');

  return true;
};

// create collection for hedis info
const insertInfo = async (info) => {
  const body = [];
  info.forEach((element) => {
    body.push({ index: { _index: 'hedis_info' } });
    body.push(element);
  });
  await db.bulk({ body });
  return true;
};

const getPayors = async () => {
  const result = await db.search({
    index: 'payors',
    size: 100,
  });
  return extractResults(result);
};

const genericSearch = async (index, query) => {
  const result = await db.search({
    index,
    body: query,
  });
  return extractResults(result);
};

const insertPayors = async (payor) => {
  const query = {
    size: 10000,
    query: {
      match: {
        value: {
          query: payor.value,
        },
      },
    },
  };
  const currentValue = await genericSearch('payors', query);
  if (currentValue.length === 0) {
    await db.index({
      index: 'payors',
      type: '_doc',
      body: payor,
    });
  }
};

const getPractitioners = async () => {
  const result = await db.search({
    index: 'practitioners',
    size: 100,
  });
  return extractResults(result);
};

const insertPractitioner = async (practitioner) => {
  const query = {
    size: 10000,
    query: {
      match: {
        value: {
          query: practitioner.value,
        },
      },
    },
  };
  const currentValue = await genericSearch('practitioners', query);
  if (currentValue.length === 0) {
    await db.index({
      index: 'practitioners',
      type: '_doc',
      body: practitioner,
    });
  }
};

const getHealthcareProviders = async () => {
  const result = await db.search({
    index: 'healthcare-providers',
    size: 100,
  });
  return extractResults(result);
};

const insertHealthcareProviders = async (provider) => {
  const query = {
    size: 10000,
    query: {
      match: {
        value: {
          query: provider.value,
        },
      },
    },
  };
  const currentValue = await genericSearch('healthcare-providers', query);
  if (currentValue.length === 0) {
    await db.index({
      index: 'healthcare-providers',
      type: '_doc',
      body: provider,
    });
  }
};

const getHealthcareCoverages = async () => {
  logger.info('Insert healthcare coverage');
  const result = await db.search({
    index: 'healthcare-coverage',
    size: 100,
  });
  return extractResults(result);
};

const insertHealthcareCoverage = async (coverage) => {
  const query = {
    size: 10000,
    query: {
      match: {
        value: {
          query: coverage.value,
        },
      },
    },
  };
  const currentValue = await genericSearch('healthcare-coverage', query);
  if (currentValue.length === 0) {
    await db.index({
      index: 'healthcare-coverage',
      type: '_doc',
      body: coverage,
    });
  }
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
