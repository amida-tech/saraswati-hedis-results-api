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
};

module.exports = config;
