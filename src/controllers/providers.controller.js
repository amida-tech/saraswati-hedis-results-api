/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');
const { findProviderByQuery } = require('../utilities/filterDrawerUtil');
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
    dao.insertHealthcarProvider(jsonObject);
    return res.send(jsonObject);
  } catch (e) {
    return next(e);
  }
};
const filterSearch = async (req, res, next) => {
  const { submeasure, healthcareProviders, isComposite } = req.body;
  try {
    const foundMembers = await findProviderByQuery(submeasure, healthcareProviders, isComposite);
    const message = foundMembers.length > 0 ? 'Success' : 'Failed to find members from the given filter options';
    const response = {
      message,
      submeasure,
      healthcareProviders,
      isComposite,
      foundMembersCount: foundMembers.length,
      foundMembers,
    };
    return res.send(response);
  } catch (e) {
    return next(e);
  }
};
module.exports = {
  getHealthcareProviders,
  postHealthcareProvider,
  filterSearch,
};
