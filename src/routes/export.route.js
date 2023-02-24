const express = require('express');
const { validate } = require('express-validation');
const exportCtrl = require('../controllers/export.controller');
const paramValidation = require('../config/param-validation');

const router = express.Router();

router.route('/generateTest')
  .get(exportCtrl.generateTest);

router.route('/member')
  .get(validate(paramValidation.memberInfo), exportCtrl.generateMemberById);

router.route('/qrda1')
  .get(validate(paramValidation.memberInfo), exportCtrl.qrda1);

router.route('/qrda3')
  .get(validate(paramValidation.exportCsv), exportCtrl.qrda3);

module.exports = router;
