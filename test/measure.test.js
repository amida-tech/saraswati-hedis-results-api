/* eslint-env jest */
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../src/express');
const config = require('../src/config');
const db = require('../src/sequelize');

const apiVersionPath = `/api/v${config.apiVersion}`;

describe('## User APIs', () => {
  let testApp;

  beforeAll(() => {
    testApp = request(app);
  });

  afterAll((done) => {
    db.sequelize.close(done);
  });

  let newMeasure = {
    name: 'test_measure',
    displayName: 'Test Measure',
    eligiblePopulation: 12343,
    included: 56578,
    percentage: 12,
    rating: '3.5'
  }

  describe(`# POST ${apiVersionPath}/measures/`, () => {
    test('should create a new measure', (done) => {
      testApp
        .post(`${apiVersionPath}/measures`)
        .send(newMeasure)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).toEqual(newMeasure.name);
          expect(res.body.displayName).toEqual(newMeasure.displayName);
          expect(res.body.eligiblePopulation).toEqual(newMeasure.eligiblePopulation);
          expect(res.body.included).toEqual(newMeasure.included);
          expect(res.body.percentage).toEqual(newMeasure.percentage);
          expect(res.body.rating).toEqual(newMeasure.rating);
          newMeasure.id = res.body.id
          //newMeasure = res.body
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${apiVersionPath}/measures/`, () => {
    test('should get all measures', (done) => {
      testApp
        .get(`${apiVersionPath}/measures/`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(Array.isArray(res.body))
          done();
        })
        .catch(done);
    });
  });


  describe(`# PUT ${apiVersionPath}/measures/:id`, () => {
    test('should update measure details', (done) => {
      newMeasure.displayName = 'Updated Test Measure';
      testApp
        .put(`${apiVersionPath}/measures/${newMeasure.id}`)
        .send(newMeasure)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body[1][0].displayName).toEqual('Updated Test Measure');
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${apiVersionPath}/measures/:id`, () => {
    test('should get measure details', (done) => {
      testApp
        .get(`${apiVersionPath}/measures/${newMeasure.id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).toEqual(newMeasure.name);
          expect(res.body.displayName).toEqual(newMeasure.displayName);
          expect(res.body.eligiblePopulation).toEqual(newMeasure.eligiblePopulation);
          expect(res.body.included).toEqual(newMeasure.included);
          expect(res.body.percentage).toEqual(newMeasure.percentage);
          expect(res.body.rating).toEqual(newMeasure.rating);
          done();
        })
        .catch(done);
    });
  });

  describe(`# DELETE ${apiVersionPath}/measures/:id`, () => {
    test('should delete measure details', (done) => {
      testApp
        .delete(`${apiVersionPath}/measures/${newMeasure.id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).toEqual('Measure deleted');
          done();
        })
        .catch(done);
    });
  });


    // Add proper error handling for this
    // test('should report error with message - Not found, when user does not exist', (done) => {
    //   testApp
    //       .get(`${apiVersionPath}/measures/12345`)
    //       .expect(httpStatus.NOT_FOUND)
    //       .then((res) => {
    //           expect(res.body.message).toEqual('Not Found');
    //           done();
    //       })
    //       .catch(done);
    // });
});