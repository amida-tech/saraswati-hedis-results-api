const express = require('express');
const memberCtrl = require('../controllers/member.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/info')
  .get(memberCtrl.getMemberInfo);

module.exports = router;
