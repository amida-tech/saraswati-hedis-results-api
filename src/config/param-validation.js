const Joi = require('joi');

const measureBody = Joi.object({
  name: Joi.string().required(),
  displayName: Joi.string().required(),
  eligiblePopulation: Joi.number().required(),
  included: Joi.number().required(),
  rating: Joi.number().required(),
  numerator: Joi.number(),
  denominator: Joi.number(),
  expressions: Joi.object(),
  improvements: Joi.object(),
  impact: Joi.object()
})


const measure = {
  body: measureBody,
}


module.exports = {
  createMeasure: measure,
  createMeasureBulk: {
    body: Joi.array().items(measureBody)
  },
};
