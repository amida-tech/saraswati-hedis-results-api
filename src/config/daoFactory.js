const dao = require('./dao');
const dao2 = require('./dao2');

const config = require('./config');

const getDao = () => {
  if (config.dbType === 'mongo') {
    return dao;
  } if (config.dbType === 'elasticSearch') {
    return dao2;
  }
  throw new Error('No database defined');
};

module.exports = {
  getDao,
};
