/* eslint-disable no-underscore-dangle */
const dao = require('../config/daoFactory').getDao();
// Get Healthcar Providers
const getHealthcareProviders = async (req, res, next) => {
  try {
    const healthcareProviders = await dao.getHealthcareProviders();
    return res.send({ healthcareProviders });
  } catch (e) {
    return next(e);
  }
};
// Add (POST) Providers
const postHealthcareProvider = async (req, res, next) => {
  try {
    const jsonObject = req.body;
    dao.insertHealthcareProviders(jsonObject);
    return res.send(jsonObject);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getHealthcareProviders,
  postHealthcareProvider,
};
