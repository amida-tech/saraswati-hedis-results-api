/* eslint-env jest */
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../src/config/express');
const config = require('../src/config/config');

const apiVersionPath = `/api/v${config.apiVersion}`;

describe('## Misc', () => {
  let testApp;

  beforeAll(() => {
    testApp = request(app);
  });

  describe(`# GET ${apiVersionPath}/health-check`, () => {
    test('should return OK', async (done) => {
      try {
        const res = await testApp
          .get(`${apiVersionPath}/health-check`)
          .expect(httpStatus.OK);
        expect(res.text).toEqual('OK');
      } finally {
        done();
      }
    });
  });
});
