const express = require('express');
// const { validate } = require('express-validation');
// const paramValidation = require('../config/param-validation');
const userCtrl = require('../controllers/user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/roles')
  .get(userCtrl.getUserRoles);

// to be used later
// router.route(`/roles/userinrole?role=${role}`)
//   .get(userCtrl.authUserRole)

module.exports = router;
