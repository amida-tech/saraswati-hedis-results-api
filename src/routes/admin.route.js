const express = require('express');

const router = express(); // eslint-disable-line new-cap
const {
  // accessControl,
  getUsers,
  getUsersByEmail,
  addUser,
  updateUser,
  loginUser,
  deleteUser,
  filterUsers,
} = require('../controllers/admin.controller');

router.get('/users', getUsers, (req, res) => {
  const users = req.Users;
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

router.get('/users/email', getUsersByEmail, (req, res) => {
  const user = req.User;
  if (user.length > 0) {
    res.status(200).json({
      status: 'Success',
      message: `Found user by given email: ${req.query.email}`,
      userCount: user.length,
      user,
    });
  } else {
    res.status(200).json({
      status: 'Failed',
      message: `No found user by given email: ${req.query.email}`,

      userCount: user.length,
      user,
    });
  }
});

router.put('/users', updateUser, (req, res) => {
  const user = req.updatedUser;
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

router.post('/users', filterUsers, addUser, (req, res) => {
  const user = req.newUser;
  if (user.insertedCount > 0) {
    res.status(200).json({
      status: 'Success',
      message: `User registration to database with given email: ${req.body.email}`,
      userCount: user.ops.length,
      user: user.ops,
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

router.delete('/users', deleteUser, (req, res) => {
  res.status(200).json({ status: 'Success', message: 'USER DELETED SUCCESSFULLY' });
});

router.post('/login', getUsersByEmail, loginUser, (req, res) => {
  const user = req.updatedUser;
  if (user.ok > 0) {
    res.status(200).json({
      status: 'Success',
      message: `Successful login of user by given email: ${req.body.email}`,
    });
  } else {
    res.status(200).json({
      status: 'Failed',
      message: `Unsuccessful login of user by given email: ${req.body.email}`,
    });
  }
});

module.exports = router;
