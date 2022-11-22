const express = require('express');
const { user } = require('pg/lib/defaults');

const router = express(); // eslint-disable-line new-cap
// const { accessControl } = require('../controllers/users.controller');
const {
  getUserProfileByEmail,
  updateUserProfile,
} = require('../controllers/profile.controller');

router.get('/email', getUserProfileByEmail, (req, res) => {
  const user = req.foundUser;
  // const selectUserFound = req.verifiedUser;
  if (user.length > 0) {
    res.status(200).json({
      status: 'Success',
      message: `Found user preferences by given email: ${req.query.email}`,
      userCount: user.length,
      userPrefrence: user[0].foundUser,
    });
  } else {
    res.status(200).json({
      status: 'Failed',
      message: `No found user preferences by given email: ${req.query.email}`,
      userCount: user.length,
      user: {},
    });
  }
});

router.put('/', getUserProfileByEmail, updateUserProfile, (req, res) => {
  const user = req.updatedUser;
  const selectUserFound = req.verifiedUser;
  if (user.ok > 0) {
    res.status(200).json({
      status: 'Success',
      message: `Successful update of user preferences by given email: ${req.body.email}`,
    });
  } else {
    res.status(200).json({
      status: 'Failed',
      message: `Unsuccessful update of user preferences by given email: ${req.body.email}`,
    });
  }
});

module.exports = router;

