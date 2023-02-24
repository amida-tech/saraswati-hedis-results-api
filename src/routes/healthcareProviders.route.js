const express = require('express');
const providerCtrl = require('../controllers/providers.controller');

const router = express.Router();

router.route('/').get(providerCtrl.getHealthcareProviders);
if (process.env.NODE_ENV !== 'production') {
  router.route('/storeProvider').post(providerCtrl.postHealthcareProvider);
}

module.exports = router;
