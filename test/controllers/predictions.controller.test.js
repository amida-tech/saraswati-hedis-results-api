/* eslint-env jest */

const fs = require('fs');
const path = require('path');

const {
  getPredictions,
  getPredictionData,
  postPredictions,
} = require('../../src/controllers/prediction.controller');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));
const queryOrParams = { measure: 'drre' };

jest.mock('../../src/config/dao', () => {
  const originalModule = jest.requireActual('../../src/config/dao');
  return {
    __esModule: true,
    ...originalModule,
    findMeasureResults: jest.fn(() => []),
    getPredictions: jest.fn(() => {}),
    insertPredictions: jest.fn(() => []),
  };
});

describe('## prediction.controller.js', () => {
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

  describe('Test postPredictions', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await postPredictions({ body: data }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });
});
