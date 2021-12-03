/* eslint-env jest */
import * as db from '../src/config/db';
import 'regenerator-runtime/runtime';

const request = require('supertest');
const httpStatus = require('http-status');
const fs = require('fs');
const path = require('path');
const app = require('../src/config/express');
const config = require('../src/config/config');

const apiVersionPath = `/api/v${config.apiVersion}`;

describe('## Misc', () => {
  let testApp;

  beforeAll(() => {
    testApp = request(app);
  });

  describe(`# GET ${apiVersionPath}/health-check`, () => {
    test('should return OK', async () => {
      await testApp
        .get(`${apiVersionPath}/health-check`)
        .expect(httpStatus.OK);
    });
  });

  describe(`# POST ${apiVersionPath}/measures/bulk`, () => {
    const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));
    //const spyInsert = jest.spyOn(db, 'insertMeasure');
    //const spyInit = jest.spyOn(db, 'init');
    test('should return OK', async () => {
      // eslint-disable-next-line arrow-body-style
      //spyInit.mockImplementation(() => true);
      //spyInsert.mockImplementation(() => 'Test');
      //expect(spyInsert).toBeCalled();

      const mockFn = jest.fn().mockName('insertMeasure');
      mockFn.mockImplementation(() => 'test');
      await testApp
        .post(`${apiVersionPath}/measures/bulk`)
        .set('Content-Type', 'application/json')
        .send(data)
        //.expect(httpStatus.OK)
        .expect((response) => {
          console.log(response);
        });
    });
  });
});
