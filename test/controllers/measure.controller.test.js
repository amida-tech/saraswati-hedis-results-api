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
  searchMeasureResults,
} = require('../../src/controllers/measure.controller');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));
const queryParams = { measure: 'drre' };

jest.mock('../../src/config/dao', () => {
  const originalModule = jest.requireActual('../../src/config/dao');

  return {
    __esModule: true,
    ...originalModule,
    getMeasures: jest.fn(() => []),
    getMeasureResults: jest.fn(() => []),
    getPredictions: jest.fn(() => {}),
    getSimulatedHedis: jest.fn(() => []),
    insertMeasure: jest.fn(() => {}),
    insertMeasures: jest.fn(() => []),
    insertMeasureResults: jest.fn(() => []),
    insertPredictions: jest.fn(() => []),
    insertSimulatedHedis: jest.fn(() => []),
  };
});

describe('## measure.controller.js', () => {
  describe('Test List function', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await list({}, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test Create function', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await create({ body: data }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test CreateBulk upload', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await createBulk({ body: data }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test DisplayHedis', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await displayHedis({ }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test createSimulatedHedis', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await createSimulatedHedis({ body: data }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test displayPredictions', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await displayPredictions({ }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test createPredictions', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await createPredictions({ body: data }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test searchMeasureResults', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await searchMeasureResults({ query: queryParams }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });
});
