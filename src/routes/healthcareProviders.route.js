const express = require('express');
const providerCtrl = require('../controllers/providers.controller');
const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get(providerCtrl.getHealthcareProviders);
router.route('/filterSearch').post(providerCtrl.filterSearch);
router.route('/storeProvider').post(providerCtrl.postHealthcareProvider);
module.exports = router;
