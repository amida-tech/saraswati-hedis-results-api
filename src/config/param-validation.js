const Joi = require('joi');

const measure = {
  body: Joi.object({
    name: Joi.string().required(),
    displayName: Joi.string().required(),
    eligiblePopulation: Joi.number().required(),
    included: Joi.number().required(),
    rating: Joi.number().required(),
    expressions: Joi.object(),
    improvements: Joi.object(),
    impact: Joi.number()
  }),
}

module.exports = {
  createMeasure: measure,
  createMeasures: {
    body: Joi.array().items(measure)
  },
};
