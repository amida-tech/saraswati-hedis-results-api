const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('../config/param-validation');
const measureCtrl = require('../controllers/measure.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(measureCtrl.list)
  .post(validate(paramValidation.createMeasure), measureCtrl.create);

router.route('/bulk')
  .post(validate(paramValidation.createMeasureBulk), measureCtrl.createBulk);

router.route('/simulated_hedis')
  .get(measureCtrl.displayHedis)
  .post(measureCtrl.createSimulatedHedis);

router.route('/predictions')
  .get(measureCtrl.displayPredictions)
  .post(measureCtrl.createPredictions);

module.exports = router;
