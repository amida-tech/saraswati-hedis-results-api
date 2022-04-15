/* eslint-env jest */

const fs = require('fs');
const path = require('path');

const {
  getMeasures,
  getMeasureResults,
  getTrends,
  getPredictions,
  getPredictionData,
  postBulkMeasures,
  postMeasure,
  postMeasureResults,
  postPredictions,
} = require('../../src/controllers/measure.controller');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));
const queryParams = { measure: 'drre' };

jest.mock('../../src/config/dao', () => {
  const originalModule = jest.requireActual('../../src/config/dao');

  return {
    __esModule: true,
    ...originalModule,
    findMeasures: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    findMeasureResults: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    findPredictions: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    insertMeasure: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    insertMeasures: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    insertMeasureResults: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    insertPredictions: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
  };
});

describe('## measure.controller.js exceptions', () => {
  describe('Test getMeasures function', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await getMeasures({}, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test getMeasureResults', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await getMeasureResults({ body: data }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test getTrends', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await getTrends({ query: queryParams }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test getPredictions', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await getPredictions({ }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test getPredictionData', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await getPredictionData({ body: data }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test postBulkMeasures upload', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await postBulkMeasures({ body: data }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test postMeasure function', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await postMeasure({ body: data }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test postMeasureResults function', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await postMeasureResults({ body: data }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test postPredictions', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await postPredictions({ body: data }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});
