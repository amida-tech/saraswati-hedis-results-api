const Joi = require('joi');

module.exports = {
  createMeasure: {
    body: Joi.object({
      name: Joi.string().required(),
      displayName: Joi.string().required(),
      eligiblePopulation: Joi.number().required(),
      included: Joi.number().required(),
      rating: Joi.number().required(),
      percentage: Joi.number().required(),
    }),
  },
  updateMeasure: {
    body: Joi.object({
      id: Joi.number(),
      name: Joi.string(),
      displayName: Joi.string(),
      eligiblePopulation: Joi.number(),
      included: Joi.number(),
      rating: Joi.number(),
      percentage: Joi.number(),
    }),
  },
};
