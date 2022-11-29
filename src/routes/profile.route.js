const express = require('express');

const router = express(); // eslint-disable-line new-cap

const {
  getUserProfileByEmail,
  updateUserProfile,
} = require('../controllers/profile.controller');

router.get('/email', getUserProfileByEmail, (req, res) => {
  const user = req.foundUser;
  if (user.length > 0) {
    res.status(200).json({
      status: 'Success',
      message: `Found user preferences by given email: ${req.query.email}`,
      userCount: user.length,
      userPrefrence: user,
    });
  } else {
    res.status(404).json({
      status: 'Failed',
      message: 'USER NOT FOUND',
      userCount: user.length,
      userPrefrence: {},
    });
  }
});

router.put('/', getUserProfileByEmail, updateUserProfile, (req, res) => {
  const user = req.updatedUser;
  if (user.ok > 0) {
    res.status(200).json({
      status: 'Success',
      message: `Successful update of user preferences by given email: ${req.body.email}`,
    });
  } else {
    res.status(404).json({
      status: 'Failed',
      message: `Unsuccessful Update of user preferences by given email: ${req.body.email}`,
    });
  }
});
module.exports = router;
