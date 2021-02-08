const fetch = require('jest-fetch-mock'); // eslint-disable-line import/no-extraneous-dependencies, import/newline-after-import
const config = require('./src/config');
const { createLoggerWithOptions } = require('./src/winston');

/**
 * Some tests make use of supertest which sets up the app straight from root index.js
 * The overwhelming majority of the rest don't do this, however, and so we must create
 * our default logger here so files we test that make use of it can access it.
 */
const loggerOptions = {
    name: config.loggerName,
    env: config.env,
    logLevel: config.logLevel,
};
createLoggerWithOptions(loggerOptions);

global.fetch = fetch;
