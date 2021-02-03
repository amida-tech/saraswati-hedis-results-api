const httpStatus = require('http-status');
const { Measure } = require('../sequelize');
const runAsyncWrapper = require('../util/asyncWrapper');

const list = runAsyncWrapper(async (req, res) => {
  const measures = await Measure.findAll();
  return res.send(measures);
});

const create = runAsyncWrapper(async (req, res) => {
  const measure = await Measure.create({
    name: req.body.name,
    displayName: req.body.displayName,
    eligblePopulation: req.body.eligblePopulation,
    included: req.body.included,
    rating: req.body.rating,
    percentage: req.body.percentage
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

const update = runAsyncWrapper(async (req, res, next) => {
  let updatedRecord = {};
  let measureKeys = ['name', 'displayName', 'eligiblePopulation', 'included', 'rating', 'percentage'];
  Object.keys(req.body).forEach(key =>
    {
      if (measureKeys.includes(key)){
        updatedRecord[key] = req.body[key];
      }
    });
  console.log("updatedRecord", updatedRecord)

  const [rowUpdate, [updatedMeasure]] = await Measure.update(
    updatedRecord,
    {returning: true, where: { id: req.params.id } }
  )
  if (!updatedMeasure) {
    const e = new Error('Measure does not exist');
    e.status = httpStatus.NOT_FOUND;
    return next(e);
  }
  return res.json(updatedMeasure)
});

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
  update
};
