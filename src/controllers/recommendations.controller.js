/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

// Get Providers
const getRecommendations = async (req, res, next) => {
  const { formattedMemberData } = req.body
  try {
    const recommendations = await dao.recommendationsGenerator(formattedMemberData);
    req.recommendations = recommendations
    next()
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getRecommendations,
};
