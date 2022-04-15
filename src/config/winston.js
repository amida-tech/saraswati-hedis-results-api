const { configuredFormatter } = require('winston-json-formatter');

const { createLogger, transports } = require('winston');
const pjson = require('../../package.json');
const config = require('./config');

const logger = createLogger({
  level: config.env === 'test' ? [] : config.logLevel,
  transports: [
    new transports.Console(),
  ],
});

const options = {
  service: 'saraswati-hedis-results-api',
  logger: 'application-logger',
  version: pjson.version,
};

logger.format = configuredFormatter(options);

module.exports = logger;
