/* eslint-env jest */

const fs = require('fs');
const path = require('path');

const {
  list,
  create,
  createBulk,
  displayHedis,
  createSimulatedHedis,
  displayPredictions,
  createPredictions,
} = require('../../src/controllers/measure.controller');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));

jest.mock('../../src/config/db', () => {
  const originalModule = jest.requireActual('../../src/config/db');

  return {
    __esModule: true,
    ...originalModule,
    getMeasures: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    insertMeasure: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    insertMeasures: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    insertSimulatedHedis: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    getSimulatedHedis: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    getPredictions: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    insertPredictions: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
  };
});

describe('## measure.controller.js exceptions', () => {
  describe('Test List function', () => {
    it('Should should catch error and call next', async () => {
      const next = jest.fn();
      await list({}, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test Create function', () => {
    it('Should should catch error and call next', async () => {
      const next = jest.fn();
      await create({ body: data }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test CreateBulk upload', () => {
    it('Should should catch error and call next', async () => {
      const next = jest.fn();
      await createBulk({ body: data }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test DisplayHedis', () => {
    it('Should should catch error and call next', async () => {
      const next = jest.fn();
      await displayHedis({ }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test createSimulatedHedis', () => {
    it('Should should catch error and call next', async () => {
      const next = jest.fn();
      await createSimulatedHedis({ body: data }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test displayPredictions', () => {
    it('Should should catch error and call next', async () => {
      const next = jest.fn();
      await displayPredictions({ }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Test createPredictions', () => {
    it('Should should catch error and call next', async () => {
      const next = jest.fn();
      await createPredictions({ body: data }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});
