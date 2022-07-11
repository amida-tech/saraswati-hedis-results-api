/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');
const { findProviderByQuery } = require('../utilities/filterDrawerUtil')
// Get Healthcar Providers
const getHealthcareProviders = async (req, res, next) => {
  try {
    const healthcareProviders = await dao.getHealthcareProviders();
    return res.send({ healthcareProviders : healthcareProviders});

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
  const {subMeasure, healthcareProviders, isComposite } = req.body;
  try {
    const foundMembers = await findProviderByQuery(subMeasure, healthcareProviders, isComposite)
    if(foundMembers.length > 0 ){
      res.send({
        status:"Success",
        subMeasure,
        healthcareProviders: healthcareProviders,
        isComposite,
        foundMembersCount: foundMembers.length,
        foundMembers: foundMembers 
      })
    } else {
      res.send({
        status:"Fail",
        subMeasure,
        healthcareProviders: healthcareProviders,
        isComposite,
        foundMembersCount: foundMembers.length,
        foundMembers: foundMembers 
      })
    }
  } catch (e) {
    return next(e);
  }
}
module.exports = {
    getHealthcareProviders,
    postHealthcareProvider,
    filterSearch,
};
