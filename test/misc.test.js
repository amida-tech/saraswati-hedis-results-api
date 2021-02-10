/* eslint-env jest */
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../src/config/express');
const config = require('../src/config/config');
const db = require('../src/config/sequelize');

const apiVersionPath = `/api/v${config.apiVersion}`;

describe('## Misc', () => {
  let testApp;

  beforeAll(() => {
    testApp = request(app);
  });

  afterAll(async (done) => {
    // remove seeded data for subsequent tests
    await db.Measure.destroy({ truncate: true });
    db.sequelize.close(done);
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

  describe(`# GET ${apiVersionPath}/seed`, () => {
    test('should return with success', async (done) => {
      try {
        const res = await testApp
          .get(`${apiVersionPath}/seed`)
          .expect(httpStatus.OK);
        expect(res.text).toEqual('Database seeded');
      } finally {
        done();
      }
    });

    test('should indicate that database has already been seeded', async (done) => {
      try {
        const res = await testApp
          .get(`${apiVersionPath}/seed`)
          .expect(httpStatus.OK);
        expect(res.text).toEqual('Database has already been seeded');
      } finally {
        done();
      }
    });
  });
});
