/**
 * express-validation exposes a version of Joi as a hard dependency,
 * in order to avoid compatibility issues with other versions of Joi.
 */
const { Joi } = require('express-validation');

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

const memberInfo = {
  query: Joi.object({
    memberId: Joi.string().required(),
  }),
};

module.exports = {
  createMeasure: measure,
  createMeasureBulk: {
    body: Joi.array().items(measureBody),
  },
  searchMeasurements: measurementQuery,
  exportCsv,
  memberInfo,
};
