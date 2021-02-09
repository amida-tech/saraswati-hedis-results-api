/* eslint-env jest */
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../src/express');
const config = require('../src/config');
const db = require('../src/sequelize');
const measures = require('../src/seedData');

const apiVersionPath = `/api/v${config.apiVersion}`;

describe('## User APIs', () => {
  let testApp;

  beforeAll(() => {
    testApp = request(app);
  });

  afterAll((done) => {
    db.sequelize.close(done);
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

  const newMeasure = {
    name: "test_measureeee",
    displayName: "Test Measure",
    eligiblePopulation: 12343,
    included: 56578,
    percentage: Math.round(100 * 12343 / 56578),
    rating: 3,
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
          expect(+res.body.rating).toEqual(newMeasure.rating);
          newMeasure.id = res.body.id
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
          expect(+res.body.rating).toEqual(newMeasure.rating);
          done();
        })
        .catch(done);
    });
  });

  // describe(`# PUT ${apiVersionPath}/measures/:id`, () => {
  //   test('should update measure details', (done) => {
  //     newMeasure.displayName = 'Updated Test Measure';
  //     testApp
  //       .put(`${apiVersionPath}/measures/${newMeasure.id}`)
  //       .send(newMeasure)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.displayName).toEqual('Updated Test Measure');
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });

  // describe(`# GET ${apiVersionPath}/measures/`, () => {
  //   test('should get all measures', (done) => {
  //     testApp
  //       .get(`${apiVersionPath}/measures/`)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body[0].name).toEqual(newMeasure.name);
  //         expect(res.body[0].displayName).toEqual(newMeasure.displayName);
  //         expect(res.body[0].eligiblePopulation).toEqual(newMeasure.eligiblePopulation);
  //         expect(res.body[0].included).toEqual(newMeasure.included);
  //         expect(res.body[0].percentage).toEqual(newMeasure.percentage);
  //         expect(+res.body[0].rating).toEqual(newMeasure.rating);
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });

  // describe(`# DEL ${apiVersionPath}/measures/:id`, () => {
  //   test('should delete measure details', (done) => {
  //     testApp
  //       .put(`${apiVersionPath}/measures/${newMeasure.id}`)
  //       .send(newMeasure)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.text).toEqual('Measure deleted');
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });

  







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

  // describe(`# GET ${apiVersionPath}/measures`, () => {
  //   test('should get list of measures', (done) => {
  //     testApp
  //       .get(`${apiVersionPath}/measures`)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         res.body.map((measure, i) => {
  //           console.log("~~~~", i, measures[i])
  //           expect(measure.name).toEqual(measures[i].name);
  //           expect(measure.displayName).toEqual(measures[i].displayName);
  //           expect(measure.eligiblePopulation).toEqual(measures[i].eligiblePopulation);
  //           expect(measure.included).toEqual(measures[i].included);
  //           expect(measure.percentage).toEqual(measures[i].percentage);
  //           expect(+measure.rating).toEqual(measures[i].rating);
  //         })
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });

  // });

  

  // describe(`# GET ${apiVersionPath}/users/`, () => {
  //     test('should get all users', (done) => {
  //         testApp
  //             .get(`${apiVersionPath}/users`)
  //             .expect(httpStatus.OK)
  //             .then((res) => {
  //                 expect(Array.isArray(res.body));
  //                 done();
  //             })
  //             .catch(done);
  //     });

  //     test('should get all users (with limit and skip)', (done) => {
  //         testApp
  //             .get(`${apiVersionPath}/users`)
  //             .query({ limit: 10, skip: 1 })
  //             .expect(httpStatus.OK)
  //             .then((res) => {
  //                 expect(Array.isArray(res.body));
  //                 done();
  //             })
  //             .catch(done);
  //     });
  // });

  // describe(`# DELETE ${apiVersionPath}/users/`, () => {
  //     test('should delete user', (done) => {
  //         testApp
  //             .delete(`${apiVersionPath}/users/${user.id}`)
  //             .expect(httpStatus.OK)
  //             .then((res) => {
  //                 expect(res.body).toEqual('KK');
  //                 done();
  //             })
  //             .catch(done);
  //     });
  // });
});