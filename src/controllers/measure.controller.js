const httpStatus = require('http-status');
const { Measure } = require('../config/sequelize');
const { insertMeasure, insertMeasures, getMeasures } = require('../config/mongo');

// sequelize converts decimals to strings, so undoing that convert
// https://github.com/sequelize/sequelize/issues/8019
const stringToDecimal = (obj) => {{
  obj.rating = +obj.rating;
}}

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

const get = async (req, res, next) => {
  try {
    const measure = await Measure.findByPk(req.params.id);
    if (!measure) {
      const e = new Error('Measure does not exist');
      e.status = httpStatus.NOT_FOUND;
      return next(e);
    }
    stringToDecimal(measure)
    return res.send(measure);
  } catch (e) {
    return next(e);
  }
};

const update = async (req, res, next) => {
  const potentialUpdates = {};
  const measureKeys = ['name', 'displayName', 'eligiblePopulation', 'included', 'rating', 'percentage'];
  Object.keys(req.body).forEach((key) => {
    if (measureKeys.includes(key)) {
      if (key === 'rating'){
        potentialUpdates[key] = +req.body[key];
      } else {
        potentialUpdates[key] = req.body[key];
      }
    }
  });
  try {
    const updatedRecordArray = await Measure.update(
      potentialUpdates,
      { returning: true, where: { id: req.params.id } },
    );
    if (!updatedRecordArray) {
      const e = new Error('Measure does not exist');
      e.status = httpStatus.NOT_FOUND;
      return next(e);
    }
    const updatedRecord = updatedRecordArray[1][0];
    stringToDecimal(updatedRecord)
    return res.send(updatedRecord);
  } catch (e) {
    return next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    await Measure.destroy({
      where: { id: req.params.id },
    });
    return res.send('Measure deleted');
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  list,
  create,
  createBulk,
  get,
  remove,
  update,
};
