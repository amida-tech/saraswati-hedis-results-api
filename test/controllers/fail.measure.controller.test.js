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
    findSimulatedHedis: jest.fn().mockImplementation(() => {
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
    insertSimulatedHedis: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
  };
});

describe('## measure.controller.js exceptions', () => {
  
  describe('Test getHedis', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await getHedis({ }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

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

  describe('Test getStarRating', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await getStarRating({ query: queryParams }, jest.fn(), next);
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

  describe('Test postCalculateAndStoreResults upload', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await postCalculateAndStoreResults({}, jest.fn(), next);
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

  describe('Test postSimulatedHedis', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await postSimulatedHedis({ body: data }, jest.fn(), next);
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
