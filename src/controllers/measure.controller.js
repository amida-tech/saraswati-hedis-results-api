const { Measure } = require('../sequelize');
const list = (async (req, res) => {
  const measures = await Measure.findAll();
  return res.send(measures);
});

const create =(async (req, res) => {
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

const get = (async (req, res) => {
  const measure = await Measure.findByPk(req.params.id)
  return res.send(measure);
});

const update = (async (req, res) => {
  let updatedRecord = {};
  let measureKeys = ['name', 'displayName', 'eligiblePopulation', 'included', 'rating', 'percentage'];
  Object.keys(req.body).forEach(key =>
    {
      if (measureKeys.includes(key)){
        updatedRecord[key] = req.body[key];
      }
    });
  console.log("updatedRecord", updatedRecord)
  try{
    const [rowUpdate, [updatedMeasure]] = await Measure.update(
      updatedRecord,
      {returning: true, where: { id: req.params.id } }
    )
    return res.json(updatedMeasure)
  } catch {
    throw new Error('Measure not found')
  }
});

const remove = (async (req, res) => {
  await Measure.destroy({
    where: { name: req.params.measure },
  });

  return res.send(true);
});

module.exports = {
  list,
  create,
  get,
  remove,
  update
};
