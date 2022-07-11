/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');
const { findCoverageByQuery } = require('../utilities/filterDrawerUtil')
// Get Healthcare Coverages
const getHealthcareCoverages = async (req, res, next) => {
  try {
    const healthcareCoverages = await dao.getHealthcareCoverages();
    return res.send({ healthcareCoverages : healthcareCoverages});

  } catch (e) {
    return next(e);
  }
};
// Add (POST) Coverages
const postHealthcareCoverage = async (req, res, next) => {
  try {
    const jsonObject = req.body;
    dao.insertHealthcareCoverage(jsonObject);
    return res.send(jsonObject);
  } catch (e) {
    return next(e);
  }
};
const filterSearch = async (req, res, next) => {
  const {subMeasure, healthcareCoverages, isComposite } = req.body;
  try {
    const foundMembers = await findCoverageByQuery(subMeasure, healthcareCoverages, isComposite)
    if(foundMembers.length > 0 ){
      res.send({
        status:"Success",
        subMeasure,
        healthcareCoverages: healthcareCoverages,
        isComposite,
        foundMembersCount: foundMembers.length,
        foundMembers: foundMembers 
      })
    } else {
      res.send({
        status:"Fail",
        subMeasure,
        healthcareCoverages: healthcareCoverages,
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
    getHealthcareCoverages,
    postHealthcareCoverage,  
    filterSearch,
};
