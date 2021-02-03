const Joi = require('joi');
const dotenv = require('dotenv');

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
    .default(3000)
    .description('Port of mock API service, defaults to 3000'),
  UNIQUE_NAME_PG_DB: Joi.string()
    .default('api')
    .description('Postgres database name'),
  UNIQUE_NAME_PG_TEST_DB: Joi.string()
    .default('api-test')
    .description('Postgres database for tests'),
  UNIQUE_NAME_PG_PORT: Joi.number()
    .default(5432),
  UNIQUE_NAME_PG_HOST: Joi.string()
    .default('localhost'),
  UNIQUE_NAME_PG_USER: Joi.string().required()
    .default('postgres')
    .description('Postgres username'),
  UNIQUE_NAME_PG_PASSWD: Joi.string().allow('')
    .default('password')
    .description('Postgres password'),
  UNIQUE_NAME_PG_SSL: Joi.bool()
    .default(false)
    .description('Enable SSL connection to PostgreSQL'),
  UNIQUE_NAME_PG_CERT_CA: Joi.string()
    .description('SSL certificate CA'), // Certificate itself, not a filename
}).unknown();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  logLevel: envVars.LOG_LEVEL,
  host: envVars.HOST,
  port: envVars.PORT,
  apiVersion: envVars.API_VERSION,
  postgres: {
    db: envVars.UNIQUE_NAME_PG_DB,
    port: envVars.UNIQUE_NAME_PG_PORT,
    host: envVars.UNIQUE_NAME_PG_HOST,
    user: envVars.UNIQUE_NAME_PG_USER,
    passwd: envVars.UNIQUE_NAME_PG_PASSWD,
    ssl: envVars.UNIQUE_NAME_PG_SSL,
    ssl_ca_cert: envVars.UNIQUE_NAME_PG_CERT_CA,
  },
};

module.exports = config;
