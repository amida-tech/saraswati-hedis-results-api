/* eslint-env jest */

const fs = require('fs');
const path = require('path');

const {
  getHedis,
  getMeasures,
  getMeasureResults,
  getStarRating,
  getTrends,
  getPredictions,
  getPredictionData,
  postBulkMeasures,
  postCalculateAndStoreResults,
  postMeasure,
  postMeasureResults,
  postSimulatedHedis,
  postPredictions,
} = require('../../src/controllers/measure.controller');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));
const queryOrParams = { measure: 'drre' };

jest.mock('../../src/config/dao', () => {
  const originalModule = jest.requireActual('../../src/config/dao');
  return {
    __esModule: true,
    ...originalModule,
    findMeasures: jest.fn(() => []),
    findMeasureResults: jest.fn(() => []),
    findSimulatedHedis: jest.fn(() => []),
    findPredictions: jest.fn(() => {}),
    insertMeasure: jest.fn(() => {}),
    insertMeasures: jest.fn(() => []),
    insertMeasureResults: jest.fn(() => []),
    insertPredictions: jest.fn(() => []),
    insertSimulatedHedis: jest.fn(() => []),
  };
});

jest.mock('../../src/calculators/NumDenCalculator', () => {
  const originalModule = jest.requireActual('../../src/calculators/NumDenCalculator');
  return {
    ...originalModule,
    calcLatestNumDen: jest.fn(() => []),
  }
});

jest.mock('../../src/calculators/TrendCalculator', () => {
  const originalModule = jest.requireActual('../../src/calculators/TrendCalculator');
  return {
    ...originalModule,
    calculateTrend: jest.fn(() => []),
  }
});

describe('## measure.controller.js', () => {
  describe('Test getHedis function', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getHedis({}, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

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

  // describe('Test getStarRating', () => {
  //   it('Should call response.send', async () => {
  //     const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
  //     await getStarRating({ query: queryOrParams }, response, jest.fn());
  //     expect(response.send).toHaveBeenCalled();
  //   });
  // });

  describe('Test getTrends function', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getTrends({}, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test getPredictions', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getPredictions({ }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test getPredictionData', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getPredictionData({ params: queryOrParams }, response, jest.fn());
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

  describe('Test postCalculateAndStoreResults function', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await postCalculateAndStoreResults({}, response, jest.fn());
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

  describe('Test postSimulatedHedis', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await postSimulatedHedis({ body: data }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test postPredictions', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await postPredictions({ body: data }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });
});
