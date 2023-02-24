const express = require('express');
const usersCtrl = require('../controllers/users.controller');

const router = express.Router();

router.route('/')
  .get(usersCtrl.getUsers);

router.route('/login')
  .post(usersCtrl.loginUser);

router.route('/')
  .delete(usersCtrl.deleteUser);

module.exports = router;
