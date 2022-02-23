const Joi = require('joi');

const measureBody = Joi.object({
  measurementType: Joi.string().required(),
  memberId: Joi.string().required(),
  timeStamp: Joi.string().required(),
});

const measure = {
  body: measureBody,
};

const measureQuery = {
  query: Joi.object({
    measurementType: Joi.string().optional(),
    memberId: Joi.string().optional(),
  }),
};

module.exports = {
  createMeasure: measure,
  createMeasureBulk: {
    body: Joi.array().items(measureBody),
  },
  searchMeasure: measureQuery,
};
