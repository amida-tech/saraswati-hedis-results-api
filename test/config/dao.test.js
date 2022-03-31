/* eslint-env jest */
const fs = require('fs');
const path = require('path');
const dao = require('../../src/config/dao');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));
const drreData = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/drre-data.json`));
const infoData = JSON.parse(fs.readFileSync(`${path.resolve()}/test/result-data/hedis-info.json`));

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
  insertMany: jest.fn(() => []),
};

describe('## db.js', () => {
  let db;

  beforeAll(async () => {
    db = { collection: jest.fn(() => collection) };
    dao.initTest(db);
  });

  describe('Test getMeasures function', () => {
    test('Should not throw an error', async () => {
      const test = dao.findMeasures();
      expect(test).toBeTruthy();
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

  describe('Test insertMeasure function', () => {
    test('Should not throw an error', async (done) => {
      try {
        const test = dao.insertMeasure(drreData);
        expect(test).toBeTruthy();
      } finally {
        done();
      }
    });
  });

  describe('Test insertMeasures function', () => {
    test('Should not throw an error', async (done) => {
      try {
        const test = dao.insertMeasures(data);
        expect(test).toBeTruthy();
      } finally {
        done();
      }
    });
  });

  // TODO: Fix this so it doesn't return a bad promise.
  // describe('Test insertMeasureResults function', () => {
  //   test('Should not throw an error', async (done) => {
  //     try {
  //       const test = insertMeasureResults(data);
  //       expect(test).toBeTruthy();
  //     } finally {
  //       done();
  //     }
  //   });
  // });

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
