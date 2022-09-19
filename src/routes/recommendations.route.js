const express = require('express');
const recommendationsCtrl = require('../controllers/recommendations.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post(recommendationsCtrl.getRecommendations)

module.exports = router;
