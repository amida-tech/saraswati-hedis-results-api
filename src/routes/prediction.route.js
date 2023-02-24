const express = require('express');
const predictionCtrl = require('../controllers/prediction.controller');

const router = express.Router();

router.route('/').get(predictionCtrl.getPredictions);
if (process.env.NODE_ENV !== 'production') {
  router.route('/').post(predictionCtrl.postPredictions);
}

router.route('/data/:measure')
  .get(predictionCtrl.getPredictionData);

module.exports = router;
