const express = require('express');
const usersCtrl = require('../controllers/users.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/login')
  .post(usersCtrl.loginUser);

module.exports = router;
