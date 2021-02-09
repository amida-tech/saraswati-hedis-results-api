const Joi = require('joi');

module.exports = {
  createMeasure: {
    body: Joi.object({
      name: Joi.string().required(),
      displayName: Joi.string().required(),
      eligiblePopulation: Joi.number().required(),
      included: Joi.number().required(),
      rating: Joi.string().required(),
      percentage: Joi.number().required(),
    }),
  },
  updateMeasure: {
    body: Joi.object({
      name: Joi.string(),
      displayName: Joi.string(),
      eligiblePopulation: Joi.number(),
      included: Joi.number(),
      rating: Joi.string(),
      percentage: Joi.number(),
    }),
  },
};
