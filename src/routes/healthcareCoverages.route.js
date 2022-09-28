const express = require('express');
const healthcareCoverageCtrl = require('../controllers/coverages.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get(healthcareCoverageCtrl.getHealthcareCoverages);
if (process.env.NODE_ENV !== 'production') {
  router.route('/storeCoverage').post(healthcareCoverageCtrl.postHealthcareCoverage);
}

module.exports = router;
