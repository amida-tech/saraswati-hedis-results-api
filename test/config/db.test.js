/* eslint-env jest */
const fs = require('fs');
const path = require('path');
const {
  insertMeasure, insertMeasures, getMeasures, insertSimulatedHedis,
  insertPredictions, getSimulatedHedis, getPredictions, initTest,
} = require('../../src/config/db');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));

const found = {
  toArray: jest.fn(() => 'test'),
};

const collection = {
  replaceOne: jest.fn(() => 'test'),
  findOneAndReplace: jest.fn(() => 'test'),
  find: jest.fn(() => found),
};

describe('## db.js', () => {
  let db;

  beforeAll(async () => {
    db = { collection: jest.fn(() => collection) };
    initTest(db);
  });

  describe('Test insertMeasure function', () => {
    test('Should not throw an error', async (done) => {
      try {
        const test = insertMeasure(data);
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

  describe('Test getMeasure function', () => {
    test('Should not throw an error', async () => {
      const test = getMeasures();
      expect(test).toBeTruthy();
    });
  });

  describe('Test insertSimulatedHedis function', () => {
    test('Should not throw an error', async () => {
      const test = insertSimulatedHedis(data);
      expect(test).toBeTruthy();
    });
  });

  describe('Test getSimulatedHedis function', () => {
    test('Should not throw an error', async () => {
      const test = getSimulatedHedis();
      expect(test).toBeTruthy();
    });
  });

  describe('Test insertPredictions function', () => {
    test('Should not throw an error', async () => {
      const test = insertPredictions(data);
      expect(test).toBeTruthy();
    });
  });

  describe('Test getPredictions function', () => {
    test('Should not throw an error', async () => {
      const test = getPredictions();
      expect(test).toBeTruthy();
    });
  });
});