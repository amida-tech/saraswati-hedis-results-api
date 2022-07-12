const express = require('express');
const { validate } = require('express-validation');
const exportCtrl = require('../controllers/export.controller');
const paramValidation = require('../config/param-validation');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/generateTest')
  .get(exportCtrl.generateTest);

router.route('/member')
  .get(validate(paramValidation.memberInfo), exportCtrl.generateMemberById);

module.exports = router;