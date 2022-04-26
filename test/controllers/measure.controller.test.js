/* eslint-env jest */

const fs = require('fs');
const path = require('path');

const {
  getMeasures,
  getMeasureResults,
  getTrends,
  getInfo,
  postBulkMeasures,
  postMeasure,
  postMeasureResults,
  postInfo,
  exportCsv,
} = require('../../src/controllers/measure.controller');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));
const queryOrParams = { measure: 'drre' };

const mockDrrePatientResults = JSON.parse(fs.readFileSync(`${path.resolve()}/test/seed-data/drre.json`));

jest.mock('../../src/config/dao', () => {
  const originalModule = jest.requireActual('../../src/config/dao');
  return {
    __esModule: true,
    ...originalModule,
    findMeasures: jest.fn(() => mockDrrePatientResults),
    findMeasureResults: jest.fn(() => []),
    findPredictions: jest.fn(() => {}),
    findInfo: jest.fn(() => []),
    insertMeasure: jest.fn(() => {}),
    insertMeasures: jest.fn(() => []),
    insertMeasureResults: jest.fn(() => []),
    insertInfo: jest.fn(() => {}),
  };
});

jest.mock('../../src/calculators/NumDenCalculator', () => {
  const originalModule = jest.requireActual('../../src/calculators/NumDenCalculator');
  return {
    ...originalModule,
    calcLatestNumDen: jest.fn(() => []),
  };
});

jest.mock('../../src/calculators/TrendCalculator', () => {
  const originalModule = jest.requireActual('../../src/calculators/TrendCalculator');
  return {
    ...originalModule,
    calculateTrend: jest.fn(() => []),
  };
});

describe('## measure.controller.js', () => {
  describe('Test getMeasures function', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getMeasures({}, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test getMeasureResults', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getMeasureResults({ query: queryOrParams }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test getTrends function', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getTrends({}, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test getInfo', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getInfo({ }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test exportCsv', () => {
    it('Should call response.send', async () => {
      const response = {
        send: jest.fn().mockReturnValue(Promise.resolve()),
        set: jest.fn().mockReturnValue({}),
      };
      await exportCsv({ }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test postBulkMeasures upload', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await postBulkMeasures({ body: data }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test postMeasure function', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await postMeasure({ body: data }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test postMeasureResults function', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await postMeasureResults({ body: data }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test postInfo', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await postInfo({ }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });
});
