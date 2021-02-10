const httpStatus = require('http-status');
const { Measure } = require('../config/sequelize');

const list = async (req, res, next) => {
  try{
    const measures = await Measure.findAll();
    return res.send(measures);
  } catch(e){
    return next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const measure = await Measure.create({
      name: req.body.name,
      displayName: req.body.displayName,
      eligiblePopulation: req.body.eligiblePopulation,
      included: req.body.included,
      rating: req.body.rating,
      percentage: req.body.percentage,
      // TODO maybe just calculate percentage and rating ourselves here?
    });
    return res.send(measure);
  } catch(e){
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
    return res.send(measure);
  } catch(e) {
    return next(e);
  }
};

const update = async (req, res, next) => {
  const potentialUpdates = {};
  const measureKeys = ['name', 'displayName', 'eligiblePopulation', 'included', 'rating', 'percentage'];
  Object.keys(req.body).forEach((key) => {
    if (measureKeys.includes(key)) {
      potentialUpdates[key] = req.body[key];
    }
  });
  try {
    const updatedRecord = await Measure.update(
      potentialUpdates,
      { returning: true, where: { id: req.params.id } },
    );
    if (!updatedRecord) {
      const e = new Error('Measure does not exist');
      e.status = httpStatus.NOT_FOUND;
      return next(e);
    }
    return res.send(updatedRecord);
  } catch (e) {
    return next(e)
  }
};

const remove = async (req, res, next) => {
  try {
    await Measure.destroy({
      where: { id: req.params.id },
    });
    return res.send('Measure deleted');
  } catch(e) {
    return next(e)
  }
};

module.exports = {
  list,
  create,
  get,
  remove,
  update,
};
