const express = require('express');
const exportCtrl = require('../controllers/export.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/generateTest')
  .get(exportCtrl.generateTest);
