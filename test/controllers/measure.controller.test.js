/* eslint-env jest */

const fs = require('fs');
const path = require('path');

const {
  getMeasureResults,
  getDailyMeasureResults,
  getTrends,
  getInfo,
  postMeasureResults,
  postInfo,
  exportCsv,
} = require('../../src/controllers/measure.controller');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));
const queryOrParams = { measure: 'drre' };

const mockDrrePatientResults = JSON.parse(fs.readFileSync(`${path.resolve()}/test/seed-data/drre.json`));
const mockMeasureInfo = JSON.parse(fs.readFileSync(`${path.resolve()}/test/result-data/hedis-info.json`));

jest.mock('../../src/config/dao', () => {
  const originalModule = jest.requireActual('../../src/config/dao');
  return {
    __esModule: true,
    ...originalModule,
    findMembers: jest.fn(() => mockDrrePatientResults),
    findMeasureResults: jest.fn(() => []),
    findPredictions: jest.fn(() => {}),
    findInfo: jest.fn(() => mockMeasureInfo),
    insertMember: jest.fn(() => {}),
    insertMembers: jest.fn(() => []),
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
    calculateTrendLegacy: jest.fn(() => []),
  };
});

describe('## measure.controller.js', () => {
  describe('Test getMeasureResults', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getMeasureResults({ query: queryOrParams }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test getDailyMeasureResults', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getDailyMeasureResults({ query: queryOrParams }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test getTrends function', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getTrends({ query: {} }, response, jest.fn());
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
      await exportCsv({ query: { measurementType: 'drre' } }, response, jest.fn());
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
