/* eslint-disable no-underscore-dangle */
const { Client } = require('@elastic/elasticsearch');
const logger = require('winston');
const mongoSanitize = require('express-mongo-sanitize');
const config = require('./config');

const connectionUrl = config.mongodb.host;

let db;

const init = async () => {
  db = new Client({
    node: connectionUrl,
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

const convertQuery = (mongoQuery) => {
  const elasticQuery = {
    query: {
      bool: {
        must: [],
      },
    },
  };

  const orStatements = { bool: { should: [] } };

  if (mongoQuery.measurementType) {
    elasticQuery.query.bool.must.push({
      term: {
        'measurementType.keyword': {
          value: mongoQuery.measurementType,
        },
      },
    });
  }

  if (mongoQuery.$and) {
    mongoQuery.$and.forEach((expr) => {
      expr.$or.forEach((expr2) => {
        const oldField = Object.keys(expr2)[0];
        let newField = oldField;
        while (newField.includes('.0') || newField.includes('.1')) {
          newField = newField.replace('.0', '').replace('.1', '');
        }
        const matcher = {
          term: {
            [newField]: {
              value: expr2[oldField],
            },
          },
        };
        orStatements.bool.should.push(matcher);
      });
    });
  }

  elasticQuery.query.bool.must.push(orStatements);
  return elasticQuery;
};

// Search members by anything else
const findMembers = async (query, from, size) => {
  let result = [];
  const queryObj = {
    index: 'measures',
    body: {},
  };
  if (query && Object.keys(query).length !== 0) {
    queryObj.body = convertQuery(query);
  }
  if (from && size) {
    queryObj.body.from = from;
    queryObj.body.size = size;
  } else {
    queryObj.body.size = 10000;
  }
  result = await db.search(queryObj);
  return extractResults(result);
};

// Search members by ID
const searchMembers = async (query) => {
  const saniQuery = mongoSanitize.sanitize(query.memberId);
  const result = await db.search({
    index: 'measures',
    size: 10000,
    body: {
      query: {
        term: {
          'memberId.keyword': {
            value: saniQuery,
          },
        },
      },
    },
  });
  return extractResults(result);
};

const paginateMembers = async (query, from, size) => {
  const results = await findMembers(query, from, size);
  return { members: results };
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
          term: {
            'measureId.keyword': {
              value: measure,
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
  if (body.length > 999) {
    let index = 0;
    while (index <= body.length) {
      const arraySlice = body.slice(index, index + 1000);
      // eslint-disable-next-line no-await-in-loop
      await db.bulk({ body: arraySlice });
      index += 1000;
    }
  } else {
    await db.bulk({ body });
  }
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
      term: {
        'value.keyword': {
          value: payor.value,
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
      term: {
        'value.keyword': {
          value: practitioner.value,
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
      term: {
        'value.keyword': {
          value: provider.value,
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
      term: {
        'value.keyword': {
          value: coverage.value,
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
  paginateMembers,
  getPayors,
  insertPayors,
  getPractitioners,
  insertPractitioner,
  getHealthcareProviders,
  insertHealthcareProviders,
  getHealthcareCoverages,
  insertHealthcareCoverage,
};
