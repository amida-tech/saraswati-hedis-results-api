const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('../config/param-validation');
const measureCtrl = require('../controllers/measure.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(measureCtrl.getMeasures)
  .post(measureCtrl.postMeasure);

router.route('/bulk')
  .post(measureCtrl.postBulkMeasures);

router.route('/info')
  .get(measureCtrl.getInfo)
  .post(measureCtrl.postInfo);

router.route('/searchResults')
  .get(validate(paramValidation.searchMeasurements), measureCtrl.getMeasureResults);

router.route('/storeResults')
  .post(measureCtrl.postMeasureResults);

router.route('/trends')
  .get(measureCtrl.getTrends);

router.route('/exportCsv')
  .get(measureCtrl.exportCsv);

module.exports = router;
