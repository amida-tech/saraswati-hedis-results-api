/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');
// Get all roles pertaining to given user
const getUserRoles = async (req, res, next) => {
  try {
    const userRoles = await dao.getUserRoles(req.body);
    return res.send(userRoles);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getUserRoles,
};
