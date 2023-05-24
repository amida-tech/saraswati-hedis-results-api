/* eslint-env jest */
const fs = require('fs');
const path = require('path');
const config = require('../../src/config/config');
const dao = require('../../src/config/dao');
const logger = require('../../src/config/winston');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));
const resultData = JSON.parse(fs.readFileSync(`${path.resolve()}/test/result-data/measure-results.json`));
const drreData = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/drre-data.json`));
const infoData = JSON.parse(fs.readFileSync(`${path.resolve()}/${config.infoLocation}`));

const found = {
  toArray: jest.fn(() => 'test'),
};

const collection = {
  replaceOne: jest.fn(() => 'test'),
  findOneAndReplace: jest.fn(() => 'test'),
  find: jest.fn((query) => {
    if (query !== undefined && query.measurement === 'drre') {
      return {
        toArray: jest.fn(() => [{ measureId: '6dccff7c-db25-a27b-d718-7189b766b218-drre-recordCount' }]),
      };
    }
    return found;
  }),
  countDocuments: jest.fn(() => 'recordCount'),
  insertMany: jest.fn(() => []),
};

describe('## db.js', () => {
  let db;
  // with the current version of Winston, transports try to fire during tests and create an error
  // by setting the logger to silent, we can avoid info logs firing off
  logger.silent = true;

  beforeAll(async () => {
    db = { collection: jest.fn(() => collection) };
    dao.initTest(db);
  });

  describe('Test getMeasures function', () => {
    test('Should not throw an error', async () => {
      const success = dao.findMembers();
      expect(success).toBeTruthy();
    });
  });

  describe('Test getMeasureResults function', () => {
    test('Should not throw an error', async () => {
      const test = dao.findMeasureResults();
      expect(test).toBeTruthy();
    });
  });

  describe('Test getPredictions function', () => {
    test('Should not throw an error', async () => {
      const test = dao.findPredictions();
      expect(test).toBeTruthy();
    });
  });

  describe('Test findInfo function', () => {
    test('Should not throw an error', async () => {
      const test = dao.findInfo();
      expect(test).toBeTruthy();
    });
  });

  describe('Test insertMember function', () => {
    test('Should not throw an error', async () => {
      const test = dao.insertMember(drreData);
      expect(test).toBeTruthy();
    });
  });

  describe('Test insertMembers function', () => {
    test('Should not throw an error', async () => {
      const test = dao.insertMembers(data);
      expect(test).toBeTruthy();
    });
  });

  // TODO: Fix this so it doesn't return a bad promise.
  describe('Test insertMeasureResults function', () => {
    test('Should not throw an error', async () => {
      const test = dao.insertMeasureResults(resultData);
      expect(test).toBeTruthy();
    });
  });

  describe('Test insertPredictions function', () => {
    test('Should not throw an error', async () => {
      const test = dao.insertPredictions(data);
      expect(test).toBeTruthy();
    });
  });

  describe('Test insertInfo function', () => {
    test('Should not throw an error', async () => {
      const test = dao.insertInfo(infoData);
      expect(test).toBeTruthy();
    });
  });
});
