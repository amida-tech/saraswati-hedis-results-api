const express = require('express');
const { user } = require('pg/lib/defaults');

const router = express(); // eslint-disable-line new-cap
const {
  // accessControl,
  getUsers,
  getUsersByEmail,
  addUser,
  updateUser,
  loginUser,
  filterUsers,
} = require('../controllers/users.controller');

router.get('/', getUsers, (req, res) => {
  const users = req.Users;
  const selectUserFound = req.verifiedUser;
  if (users.length > 0) {
    res.status(200).json({
      status: 'Success',
      message: 'Found users',
      userCount: users.length,
      users,
    });
  } else {
    res.status(200).json({
      status: 'Fail',
      message: 'No users found',
      userCount: users.length,
      users,
    });
  }

});
router.get('/email', getUsersByEmail, (req, res) => {
  const user = req.User;
  const selectUserFound = req.verifiedUser;
  if (user.length > 0) {
    res.status(200).json({
      status: 'Success',
      message: `Found user by given email: ${req.params.email}`,
      userCount: user.length,
      user,
    });
  } else {
    res.status(200).json({
      status: 'Failed',
      message: `No found user by given email: ${req.params.email}`,

      userCount: user.length,
      user,
    });
  }
});
router.put('/',  updateUser, (req, res) => {
  const user = req.updatedUser;
  const selectUserFound = req.verifiedUser;
  if (user.ok > 0) {
    res.status(200).json({
      status: 'Success',
      message: `Successful update of user by given email: ${req.body.email}`,
    });
  } else {
    res.status(200).json({
      status: 'Failed',
      message: `Unsuccessful update of user by given email: ${req.body.email}`,
    });
  }
});
router.post('/', filterUsers, addUser, (req, res) => {
  const user = req.newUser;
  const selectUserFound = req.verifiedUser;
  if (user.insertedCount > 0) {
    res.status(200).json({
      status: 'Success',
      message: `User registration to database with given email: ${req.body.email}`,
      userCount: user.ops.length,
      user:user.ops,
    });
  } else {
    res.status(200).json({
      status: 'Failed',
      message: `User not added successfully database with given email: ${req.body.email}`,
      userCount: 0,
      user: [],
    });
  }
});

// router.get //profile
// router.post //profile

router.post('/login',  getUsersByEmail, loginUser);
module.exports = router;