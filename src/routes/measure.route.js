const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('../config/param-validation');
const measureCtrl = require('../controllers/measure.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(measureCtrl.getMeasures)
  .post(measureCtrl.postMeasure);
// .post(validate(paramValidation.createMeasure), measureCtrl.create);

router.route('/bulk')
  .post(measureCtrl.postBulkMeasures);
// .post(validate(paramValidation.createMeasureBulk), measureCtrl.createBulk);

router.route('/calculate')
  .post(measureCtrl.postCalculateAndStoreResults);

router.route('/predictions')
  .get(measureCtrl.getPredictions)
  .post(measureCtrl.postPredictions);

router.route('/predictionData/:measure')
  .get(measureCtrl.getPredictionData);

router.route('/searchResults')
  .get(validate(paramValidation.searchMeasurements), measureCtrl.getMeasureResults);

router.route('/simulated_hedis')
  .get(measureCtrl.getHedis)
  .post(measureCtrl.postSimulatedHedis);

// route.route('/starRating')
//   .get(validate(paramValidation.searchMeasurements), measureCtrl.getStarRating);

router.route('/storeResults')
  .post(measureCtrl.postMeasureResults);

router.route('/trends')
  .get(measureCtrl.getTrends);

module.exports = router;
