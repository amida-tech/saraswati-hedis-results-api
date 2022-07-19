/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');
const { findPayorByQuery } = require('../utilities/filterDrawerUtil');

// Get Providers
const getPayors = async (req, res, next) => {
  try {
    const payors = await dao.getPayors();
    return res.send({ payors });
  } catch (e) {
    return next(e);
  }
};
// Add (POST) Payor/Payer
const postPayor = async (req, res, next) => {
  try {
    const jsonObject = req.body;
    dao.insertPayors(jsonObject);
    return res.send(jsonObject);
  } catch (e) {
    return next(e);
  }
};
// Filter Search payorSearch
const filterSearch = async (req, res, next) => {
  const { submeasure, payors, isComposite } = req.body;
  try {
    const foundMembers = await findPayorByQuery(submeasure, payors, isComposite);
    const message = foundMembers.length > 0 ? 'Success' : 'Failed to find members from the given filter options';
    const response = {
      message,
      submeasure,
      payors,
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
  getPayors,
  postPayor,
  filterSearch,
};
