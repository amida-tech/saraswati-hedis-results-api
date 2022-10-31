const express = require('express');
const practitionerCtrl = require('../controllers/practitioners.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get(practitionerCtrl.getPractitioners);
if (process.env.NODE_ENV !== 'production') {
  router.route('/storePractitioner').post(practitionerCtrl.postPractitioner);
}

module.exports = router;
