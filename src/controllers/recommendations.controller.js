/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

// Get Providers
const getRecommendations = async (req, res, next) => {
  const { value, measure, type, status, exclusions, dates } = req.body;
  try {
    const recommendations = await dao.getRecommendations({ 
        value,
        measure,
        type,
        status,
        exclusions,
        dates,
    });
    return res.send({ recommendations });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getRecommendations,
};
