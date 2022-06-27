/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

// Get Providers
const getProviders = async (req, res, next) => {
  try {
    const providers = await dao.findProviders();
    return res.send(providers);
  } catch (e) {
    return next(e);
  }
};



module.exports = {
  getProviders,
};
