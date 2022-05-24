const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('../config/param-validation');
const measureCtrl = require('../controllers/measure.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/info')
  .get(measureCtrl.getInfo)
  .post(measureCtrl.postInfo);

/**
 * @deprecated Use dailyMeasureResults instead.
*/
router.route('/searchResults')
  .get(validate(paramValidation.searchMeasurements), measureCtrl.getMeasureResults);

router.route('/dailyMeasureResults')
  .get(measureCtrl.getDailyMeasureResults);

router.route('/storeResults')
  .post(measureCtrl.postMeasureResults);

router.route('/trends')
  .get(measureCtrl.getTrends);

router.route('/exportCsv')
  .get(validate(paramValidation.exportCsv), measureCtrl.exportCsv);

module.exports = router;
