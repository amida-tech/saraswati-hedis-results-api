/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

// Get all records with the memberId, sort and get the latest one
const getMemberInfo = async (req, res, next) => {
  try {
    let memberResults = await dao.findMeasures(req.query);
    memberResults = memberResults.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
    return res.send(memberResults[0]);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getMemberInfo,
};
