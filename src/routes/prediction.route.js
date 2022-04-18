const express = require('express');
const predictionCtrl = require('../controllers/prediction.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(predictionCtrl.getPredictions)
  .post(predictionCtrl.postPredictions);

router.route('/data/:measure')
  .get(predictionCtrl.getPredictionData);

module.exports = router;
