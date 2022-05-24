/* eslint-env jest */

const fs = require('fs');
const path = require('path');

const {
  getMeasureResults,
  getTrends,
  postMeasureResults,
  exportCsv,
} = require('../../src/controllers/measure.controller');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));
const queryParams = { measure: 'drre' };

jest.mock('../../src/config/dao', () => {
  const originalModule = jest.requireActual('../../src/config/dao');

  return {
    __esModule: true,
    ...originalModule,
    findMembers: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    findMeasureResults: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    insertMember: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    insertMembers: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
    insertMeasureResults: jest.fn().mockImplementation(() => {
      throw new Error();
    }),
  };
});

describe('## measure.controller.js exceptions', () => {
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

  describe('Test exportCsv', () => {
    it('Should catch error and call next', async () => {
      const next = jest.fn();
      await exportCsv({ }, jest.fn(), next);
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
});
