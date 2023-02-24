const dao = require('../config/dao');

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

module.exports = {
  getPayors,
  postPayor,
};
