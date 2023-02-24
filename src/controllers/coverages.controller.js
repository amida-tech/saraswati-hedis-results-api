const dao = require('../config/dao');
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

module.exports = {
  getHealthcareCoverages,
  postHealthcareCoverage,
};
