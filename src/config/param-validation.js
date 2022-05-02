const Joi = require('joi');

const measureBody = Joi.object({
  measurementType: Joi.string().required(),
  memberId: Joi.string().required(),
  timeStamp: Joi.string().required(),
});

const measure = {
  body: measureBody,
};

const measurementQuery = {
  query: Joi.object({
    measure: Joi.string().optional(),
  }),
};

const exportCsv = {
  query: Joi.object({
    measurementType: Joi.string().required(),
  }),
};

module.exports = {
  createMeasure: measure,
  createMeasureBulk: {
    body: Joi.array().items(measureBody),
  },
  searchMeasurements: measurementQuery,
  exportCsv,
};
