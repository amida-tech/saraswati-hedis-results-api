/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');
const { findPayorByQuery } = require('../utilities/filterDrawerUtil');

// Get Providers
const getPayors = async (req, res, next) => {
  try {
    const payors = await dao.getPayors();
    return res.send({ payors : payors});

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
  const {subMeasure, payor, isComposite } = req.body;
  try {
    const foundMembers = await findPayorByQuery(subMeasure, payor, isComposite)
    if(foundMembers.length > 0 ){
      res.send({
        status:"Success",
        subMeasure,
        payor: payor,
        isComposite,
        foundMembersCount: foundMembers.length,
        foundMembers: foundMembers 
      })
    } else {
      res.send({
        status:"Fail",
        subMeasure,
        payor: payor,
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
  getPayors,
  postPayor,
  filterSearch,
};
