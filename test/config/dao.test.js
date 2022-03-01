/* eslint-env jest */
const fs = require('fs');
const path = require('path');
const {
  initTest, getMeasures, getMeasureResults, getPredictions, getSimulatedHedis,
  insertMeasure, insertMeasures, insertMeasureResults, insertPredictions,
  insertSimulatedHedis,
} = require('../../src/config/dao');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));
const drreData = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/drre-data.json`));

const found = {
  toArray: jest.fn(() => 'test'),
};

const collection = {
  replaceOne: jest.fn(() => 'test'),
  findOneAndReplace: jest.fn(() => 'test'),
  find: jest.fn((query) => {
    if (query !== undefined && query.measurement === 'drre') {
      return {
        toArray: jest.fn(() => [{ _id: '6dccff7c-db25-a27b-d718-7189b766b218-drre-recordCount' }]),
      };
    }
    return found;
  }),
  countDocuments: jest.fn(() => 'recordCount'),
};

describe('## db.js', () => {
  let db;

  beforeAll(async () => {
    db = { collection: jest.fn(() => collection) };
    initTest(db);
  });  

  describe('Test getMeasures function', () => {
    test('Should not throw an error', async () => {
      const test = getMeasures();
      expect(test).toBeTruthy();
    });
  });

  describe('Test getMeasureResults function', () => {
    test('Should not throw an error', async () => {
      const test = getMeasureResults();
      expect(test).toBeTruthy();
    });
  });

  describe('Test getPredictions function', () => {
    test('Should not throw an error', async () => {
      const test = getPredictions();
      expect(test).toBeTruthy();
    });
  });

  describe('Test getSimulatedHedis function', () => {
    test('Should not throw an error', async () => {
      const test = getSimulatedHedis();
      expect(test).toBeTruthy();
    });
  });

  describe('Test insertMeasure function', () => {
    test('Should not throw an error', async (done) => {
      try {
        const test = insertMeasure(drreData);
        expect(test).toBeTruthy();
      } finally {
        done();
      }
    });
  });

  describe('Test insertMeasures function', () => {
    test('Should not throw an error', async (done) => {
      try {
        const test = insertMeasures(data);
        expect(test).toBeTruthy();
      } finally {
        done();
      }
    });
  });

  describe('Test insertMeasureResults function', () => {
    test('Should not throw an error', async (done) => {
      try {
        const test = insertMeasureResults(data);
        expect(test).toBeTruthy();
      } finally {
        done();
      }
    });
  });

  describe('Test insertSimulatedHedis function', () => {
    test('Should not throw an error', async () => {
      const test = insertSimulatedHedis(data);
      expect(test).toBeTruthy();
    });
  });

  describe('Test insertPredictions function', () => {
    test('Should not throw an error', async () => {
      const test = insertPredictions(data);
      expect(test).toBeTruthy();
    });
  });
});
