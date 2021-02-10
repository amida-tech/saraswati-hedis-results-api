const httpStatus = require('http-status');
const { Measure } = require('../config/sequelize');
const runAsyncWrapper = require('../util/asyncWrapper');

const list = runAsyncWrapper(async (req, res) => {
  const measures = await Measure.findAll();
  return res.send(measures);
});

const create = runAsyncWrapper(async (req, res) => {
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
});

const get = runAsyncWrapper(async (req, res, next) => {
  const measure = await Measure.findByPk(req.params.id);
  if (!measure) {
    const e = new Error('Measure does not exist');
    e.status = httpStatus.NOT_FOUND;
    return next(e);
  }
  return res.send(measure);
});

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
  } catch (error) {
    return next(error)
  }
};

const remove = runAsyncWrapper(async (req, res) => {
  await Measure.destroy({
    where: { id: req.params.id },
  });

  return res.send('Measure deleted');
});

module.exports = {
  list,
  create,
  get,
  remove,
  update,
};
