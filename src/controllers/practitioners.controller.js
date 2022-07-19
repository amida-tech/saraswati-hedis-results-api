/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');
const { findPractitionersByQuery } = require('../utilities/filterDrawerUtil');

// Get Providers
const getPractitioners = async (req, res, next) => {
  try {
    const practitioner = await dao.getPractitioners();
    return res.send({ practitioner });
  } catch (e) {
    return;
    next(e);
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
  const { submeasure, practitioners, isComposite } = req.body;
  try {
    const foundMembers = await findPractitionersByQuery(submeasure, practitioners, isComposite);
    const message = foundMembers.length > 0 ? 'Success' : 'Failed to find members from the given filter options';
    const response = {
      message,
      submeasure,
      practitioners,
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
  getPractitioners,
  postPractitioner,
  filterSearch,
};
