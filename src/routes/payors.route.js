const express = require('express');
const payorCtrl = require('../controllers/payors.controller');

const router = express.Router();

router.route('/').get(payorCtrl.getPayors);
if (process.env.NODE_ENV !== 'production') {
  router.route('/storePayors').post(payorCtrl.postPayor);
}

module.exports = router;
