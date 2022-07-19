const express = require('express');
const practitionerCtrl = require('../controllers/practitioners.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get(practitionerCtrl.getPractitioners);
router.route('/filterSearch').post(practitionerCtrl.filterSearch);
router.route('/storePractitioner').post(practitionerCtrl.postPractitioner);
module.exports = router;
