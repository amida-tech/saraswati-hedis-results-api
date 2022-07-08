const express = require('express');
const practitionerCtrl = require('../controllers/practitioner.controller');
const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get(practitionerCtrl.getPractitioners);
router.route('/storePractitioner').post(practitionerCtrl.postPractitioner);
module.exports = router;
