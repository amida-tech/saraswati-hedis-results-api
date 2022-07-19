const express = require('express');
const payorCtrl = require('../controllers/payors.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get(payorCtrl.getPayors);
router.route('/filterSearch').post(payorCtrl.filterSearch);
router.route('/storePayors').post(payorCtrl.postPayor);
module.exports = router;
