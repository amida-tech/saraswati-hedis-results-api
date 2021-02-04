/* eslint-env jest */
const { expect } = require('chai');
const httpStatus = require('http-status');
const request = require('supertest-as-promised');
const app = require('../src/index');
const config = require('../src/config');
const db = require('../src/sequelize');

const apiVersionPath = `/api/v${config.apiVersion}`;

describe('## Misc', () => {
  describe(`# GET ${apiVersionPath}/health-check`, () => {
    it('should return OK', () => {
      request(app)
        .get(`${apiVersionPath}/health-check`)
        .expect(httpStatus.OK)
        .then(res => expect(res.text).to.equal('OK'))
    });
  });

  describe(`# GET ${apiVersionPath}/404`, () => {
    it('should return 404 status', () => {
      request(app)
        .get(`${apiVersionPath}/404`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => expect(res.body.message).to.equal('Not Found'))
    });
  });
});