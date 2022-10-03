const express = require('express');
const { getRecommendations } = require('../controllers/recommendations.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.post('/', getRecommendations, (req, res, next) => {
  
})

module.exports = router;
