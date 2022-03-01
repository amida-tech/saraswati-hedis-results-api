const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('../config/param-validation');
const measureCtrl = require('../controllers/measure.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(measureCtrl.list)
  .post(measureCtrl.create);
// .post(validate(paramValidation.createMeasure), measureCtrl.create);

router.route('/bulk')
  .post(measureCtrl.createBulk);
// .post(validate(paramValidation.createMeasureBulk), measureCtrl.createBulk);

router.route('/simulated_hedis')
  .get(measureCtrl.displayHedis)
  .post(measureCtrl.createSimulatedHedis);

router.route('/predictions')
  .get(measureCtrl.displayPredictions)
  .post(measureCtrl.createPredictions);

router.route('/predictionData/:measure')
  .get(measureCtrl.predictionData);

router.route('/trends')
  .get(measureCtrl.trends);

router.route('/searchResults')
  .get(validate(paramValidation.searchMeasureResults), measureCtrl.searchResults);

router.route('/calculate')
  .post(measureCtrl.calculateAndStoreResults);

router.route('/storeResults')
  .post(measureCtrl.storeResults);

module.exports = router;
