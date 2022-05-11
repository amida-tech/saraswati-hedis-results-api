/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

// Access predictions made by time series
const getMemberInfo = async (req, res, next) => {
  try {
    const memberResults = await dao.findMeasures(req.query);
    return res.send(memberResults);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getMemberInfo,
};
