const Joi = require('joi');
const dotenv = require('dotenv');
const util = require('./config-util');

dotenv.config();

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'production', 'test', 'provision')
    .default('production')
    .description('Environment of API service'),
  LOG_LEVEL: Joi.string()
    .default('info')
    .description('Log level of API service'),
  HOST: Joi.string()
    .description('Host of mock API service'),
  PORT: Joi.number()
    .default(4000)
    .description('Port of mock API service, defaults to 4000'),
  DB_NAME: Joi.string()
    .default('hedisdb')
    .description('MongoDB database'),
  DB_HOST: Joi.string()
    .description('Host of DB'),
  DB_PORT: Joi.number()
    .default(27017),
  KAFKA_BROKERS: Joi.string()
    .default('broker:29092'),
  KAFKA_QUEUE: Joi.string()
    .default('hedis-measures'),
}).unknown();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
const arrayDelimiter = util.getDelimiter(envVars.KAFKA_BROKERS);

const config = {
  env: envVars.NODE_ENV,
  logLevel: envVars.LOG_LEVEL,
  host: envVars.HOST,
  port: envVars.PORT,
  apiVersion: envVars.API_VERSION,
  mongodb: {
    port: envVars.DB_PORT,
    host: envVars.DB_HOST,
    name: envVars.DB_NAME,
  },
  kafkaConfig: {
    brokers: envVars.KAFKA_BROKERS.replace(/[["'\]]/g, '').split(arrayDelimiter),
    queue: envVars.KAFKA_QUEUE,
  }
};

module.exports = config;
