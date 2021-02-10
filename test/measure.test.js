/* eslint-env jest */
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../src/config/express');
const config = require('../src/config/config');
const db = require('../src/config/sequelize');

const apiVersionPath = `/api/v${config.apiVersion}`;

describe('## User APIs', () => {
  let testApp;

  beforeAll(() => {
    testApp = request(app);
  });

  afterAll((done) => {
    db.sequelize.close(done);
  });

  const newMeasure = {
    name: 'test_measure',
    displayName: 'Test Measure',
    eligiblePopulation: 12343,
    included: 56578,
    percentage: 12,
    rating: '3.5',
  };

  describe(`# POST ${apiVersionPath}/measures/`, () => {
    test('should create a new measure', async (done) => {
      try {
        const res = await testApp
          .post(`${apiVersionPath}/measures`)
          .send(newMeasure)
          .expect(httpStatus.OK);
        expect(res.body.name).toEqual(newMeasure.name);
        expect(res.body.displayName).toEqual(newMeasure.displayName);
        expect(res.body.eligiblePopulation).toEqual(newMeasure.eligiblePopulation);
        expect(res.body.included).toEqual(newMeasure.included);
        expect(res.body.percentage).toEqual(newMeasure.percentage);
        expect(res.body.rating).toEqual(newMeasure.rating);
        newMeasure.id = res.body.id;
      } finally {
        done();
      }
    });
  });

  describe(`# GET ${apiVersionPath}/measures/`, () => {
    test('should get all measures', async (done) => {
      try {
        const res = await testApp
          .get(`${apiVersionPath}/measures/`)
          .expect(httpStatus.OK);
        expect(Array.isArray(res.body));
      } finally {
        done();
      }
    });
  });

  describe(`# PUT ${apiVersionPath}/measures/:id`, () => {
    test('should update measure details', async (done) => {
      newMeasure.displayName = 'Test Measure 2';
      try {
        const res = await testApp
          .put(`${apiVersionPath}/measures/${newMeasure.id}`)
          .send(newMeasure)
          .expect(httpStatus.OK);
        expect(res.body[1][0].displayName).toEqual('Test Measure 2');
      } finally {
        done();
      }
    });
  });

  describe(`# GET ${apiVersionPath}/measures/:id`, () => {
    test('should get measure details', async (done) => {
      try {
        const res = await testApp
          .get(`${apiVersionPath}/measures/${newMeasure.id}`)
          .expect(httpStatus.OK);
        expect(res.body.name).toEqual(newMeasure.name);
        expect(res.body.displayName).toEqual(newMeasure.displayName);
        expect(res.body.eligiblePopulation).toEqual(newMeasure.eligiblePopulation);
        expect(res.body.included).toEqual(newMeasure.included);
        expect(res.body.percentage).toEqual(newMeasure.percentage);
        expect(res.body.rating).toEqual(newMeasure.rating);
      } finally {
        done();
      }
    });
  });

  describe(`# DELETE ${apiVersionPath}/measures/:id`, () => {
    test('should delete measure details', async (done) => {
      try {
        const res = await testApp
          .delete(`${apiVersionPath}/measures/${newMeasure.id}`)
          .expect(httpStatus.OK);
        expect(res.text).toEqual('Measure deleted');
      } finally {
        done();
      }
    });
  });
});
