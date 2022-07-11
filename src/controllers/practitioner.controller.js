/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');
const { findPractitionersByQuery } = require('../utilities/filterDrawerUtil');

// Get Providers
const getPractitioners = async (req, res, next) => {
  try {
    const practitioner = await dao.getPractitioners();
    return res.send({ practitioner : practitioner});

  } catch (e) {
    return next(e);
  }
};
const postPractitioner = async (req, res, next) => {
  try {
    const jsonObject = req.body;
    dao.insertPractitioner(jsonObject);
    return res.send(jsonObject);
  } catch (e) {
    return next(e);
  }
};
const filterSearch = async (req, res, next) => {
  const {subMeasure, practitioners, isComposite } = req.body;
  try {
    const foundMembers = await findPractitionersByQuery(subMeasure, practitioners, isComposite)
    if(foundMembers.length > 0 ){
      res.send({
        status:"Success",
        subMeasure,
        practitioners: practitioners,
        isComposite,
        foundMembersCount: foundMembers.length,
        foundMembers: foundMembers 
      })
    } else {
      res.send({
        status:"Fail",
        subMeasure,
        practitioners: practitioners,
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
  getPractitioners,
  postPractitioner,
  filterSearch,
};
