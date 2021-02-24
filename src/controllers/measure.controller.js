const { insertMeasure, insertMeasures, getMeasures } = require('../config/mongo');

const list = async (req, res, next) => {
  try {
    const measures = await getMeasures();
    //measures.forEach(measure => stringToDecimal(measure))
    return res.send(measures);
  } catch (e) {
    return next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const measure = await insertMeasure(req.body);
    return res.send(measure);
  } catch (e) {
    return next(e);
  }
};

const createBulk = async (req, res, next) => {
  try {
    const options = { ordered: true };
    const measures = await insertMeasures(req.body, options);
    return res.send(measures);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  list,
  create,
  createBulk,
};
