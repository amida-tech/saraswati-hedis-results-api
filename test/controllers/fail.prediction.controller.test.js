/* eslint-env jest */

const fs = require('fs');
const path = require('path');

const {
  getPredictions,
  getPredictionData,
  postPredictions,
} = require('../../src/controllers/prediction.controller');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));

jest.mock('../../src/config/dao', () => {
  const originalModule = jest.requireActual('../../src/config/dao');

  return {
    __esModule: true,
    ...originalModule,
    getMeasureResults: jest.fn().mockImplementation(() => {
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

describe('## prediction.controller.js exceptions', () => {
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

  describe('Test postPredictions', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await postPredictions({ body: data }, jest.fn(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});
