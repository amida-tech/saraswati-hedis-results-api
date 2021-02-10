/* eslint-env jest */
const request  = require('supertest');
const httpStatus  = require('http-status');
const app  = require('../src/express');
const config  = require('../src/config');
const db  = require('../src/sequelize');

const apiVersionPath = `/api/v${config.apiVersion}`;

describe('## Misc', () => {
  let testApp;

  beforeAll(() => {
    testApp = request(app);
  });

  afterAll(async (done) => {
    // remove seeded data for subsequent tests
    try{
      await db.Measure.destroy({ truncate: true });
      db.sequelize.close(done);
    } catch(e){
      console.log(e)
    }
  });


  describe(`# GET ${apiVersionPath}/health-check`, () => {
    test('should return OK', (done) => {
      testApp
        .get(`${apiVersionPath}/health-check`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).toEqual('OK');
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${apiVersionPath}/seed`, () => {
    test('should return with success', (done) => {
      testApp
        .get(`${apiVersionPath}/seed`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).toEqual('Database seeded');
          done();
        })
        .catch(done);
    });

    test('should indicate that database has already been seeded', (done) => {
      testApp
        .get(`${apiVersionPath}/seed`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).toEqual('Database has already been seeded');
          done();
        })
        .catch(done);
    });
  });

});