const { createLogger, format, transports, add } = require('winston');
const { configuredFormatter } = require('winston-json-formatter');
const pjson = require('../../package.json');
const config = require('./config');

const logLevels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7
}

const options = {
  service: 'saraswati-hedis-results-api',
  logger: 'application-logger',
  version: pjson.version,
};

// Handles any log that isn't a request
const logger = createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: configuredFormatter(options),
  defaultMeta: { service: 'HERA' },
  transports: [
    new transports.Console({})
  ]
});

// Handles request logs
if (config.env === 'test') {
  add(new transports.File({ filename: './reports/logs/winston-info.log' }));
} else {
  add(new transports.Console({
    format: configuredFormatter(options)
  }))
}

module.exports = logger;
