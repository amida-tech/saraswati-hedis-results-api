/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');
const { findCoverageByQuery } = require('../utilities/filterDrawerUtil');
// Get Healthcare Coverages
const getHealthcareCoverages = async (req, res, next) => {
  try {
    const healthcareCoverages = await dao.getHealthcareCoverages();
    return res.send({ healthcareCoverages });
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
  const { submeasure, healthcareCoverages, isComposite } = req.body;
  try {
    const foundMembers = await findCoverageByQuery(submeasure, healthcareCoverages, isComposite);
    const message = foundMembers.length > 0 ? 'Success' : 'Failed to find members from the given filter options';
    const response = {
      message,
      submeasure,
      healthcareCoverages,
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
  getHealthcareCoverages,
  postHealthcareCoverage,
  filterSearch,
};
