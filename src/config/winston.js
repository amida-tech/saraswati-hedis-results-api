const { createLogger, format, transports, add } = require('winston');
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

const logger = createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: format.cli(),
  defaultMeta: { service: 'HERA' },
  // the below appears to do nothing but prevent an error
  transports: [
    new transports.Console({})
  ]
});

if (config.env === 'test') {
  add(new transports.File({ filename: './reports/logs/winston-info.log' }));
} else {
  add(new transports.Console({
    format: format.cli()
  }))
}

module.exports = logger;
