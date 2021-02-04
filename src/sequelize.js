const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const config = require('./config');
const logger = require('./winston');
const seedData = require('./seedData');

const db = {};

// connect to postgres testDb
const sequelizeOptions = {
  dialect: 'postgres',
  port: config.postgres.port,
  host: config.postgres.host,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  ...(config.postgres.ssl && {
    ssl: config.postgres.ssl,
  }),
  ...(config.postgres.ssl && config.postgres.ssl_ca_cert && {
    dialectOptions: {
      ssl: {
        ca: config.postgres.ssl_ca_cert,
      },
    },
  }),
};
const sequelize = new Sequelize(
  config.postgres.db,
  config.postgres.user,
  config.postgres.passwd,
  sequelizeOptions,
);

const modelsDir = path.normalize(`${__dirname}/models`);

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDir)
  .filter((file) => (file.indexOf('.') !== 0) && (file.indexOf('.map') === -1))
  // const model files and save model names
  .forEach((file) => {
    logger.info(`Loading model file ${file}`);
    // eslint-disable-next-line import/no-dynamic-require
    // eslint-disable-next-line
    const model = require(path.join(modelsDir, file))(sequelize, Sequelize.DataTypes); 
    db[model.name] = model;
  });

const devEnv = config.env === 'development';

// Synchronizing any model changes with database.
sequelize
  .sync({ force: !!devEnv })
  .then(() => {
    logger.info('Database synchronized');
    if (devEnv) {
      seedData.forEach((record) => db.Measure.create(record));
    }
  })
  .catch((error) => {
    if (error) {
      logger.error('An error occured: ', error);
    }
  });

// assign the sequelize variables to the db object and returning the db.
module.exports = _.extend({
  sequelize,
  Sequelize,
}, db);
