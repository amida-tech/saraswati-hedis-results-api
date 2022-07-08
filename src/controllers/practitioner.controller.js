/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

// Get Providers
const getPractitioners = async (req, res, next) => {
  try {
    const practitioner = await dao.getPractitioners();
    return res.send({ practitioner : practitioner});

  } catch (e) {
    return next(e);
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
module.exports = {
  getPractitioners,
  postPractitioner,
};
