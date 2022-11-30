const winstonInstance = require('../config/winston');
const dao = require('../config/dao');

const getUsers = async (req, res, next) => {
  try {
    const allUsers = await dao.getUsers();
    req.Users = allUsers;
    next();
  } catch (error) {
    winstonInstance.error(error);
  }
};

const getUsersByEmail = async (req, res, next) => {
  const { email } = req.query;
  try {
    const userByEmail = await dao.getUsersByEmail(email);
    req.User = userByEmail;
    next();
  } catch (error) {
    winstonInstance.error(error);
  }
};

const addUser = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    role,
    companyName,
    companyPreferences,
    userPreferences,
    created_on,
    updated_on,
    lastLogin,
    active,
  } = req.body;
  const userToAdd = {
    email,
    firstName,
    lastName,
    role,
    companyName,
    companyPreferences,
    userPreferences,
    created_on,
    updated_on,
    lastLogin,
    active,
  };
  try {
    const addedUser = await dao.addUsers(userToAdd);
    req.newUser = addedUser;
    next();
  } catch (error) {
    winstonInstance.error(error);
  }
};

const updateUser = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    role,
    companyName,
    companyPreferences,
    userPreferences,
    created_on,
    active,
    lastLogin,
  } = req.body;
  try {
    const userToUpdate = {
      email,
      firstName,
      lastName,
      role,
      companyName,
      companyPreferences,
      userPreferences,
      created_on,
      updated_on: Date.now(),
      lastLogin,
      active,
    };
    const updatedUser = await dao.updateUserByEmail(userToUpdate, email.toLowerCase());
    req.updatedUser = updatedUser;
    next();
  } catch (error) {
    winstonInstance.error(error);
  }
};

const loginUser = async (req, res, next) => {};

const filterUsers = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (email) {
      const UsersFound = await dao.getUsersByEmail(email.toLowerCase());
      if (UsersFound.length === 0) {
        next();
      } else {
        res.status(403).json({
          status: 'Fail',
          message: 'User already exist in database. Please check credentials.',
        });
      }
    } else {
      res.status(404).json({
        status: 'Fail',
        message: 'USER NOT FOUND',
      });
    }
  } catch (error) {
    winstonInstance.error(error);
  }
};
const deleteUser = async (req, res, next) => {
  const { email } = req.query;
  try {
    const DeleteUserStatus = await dao.deleteUserByEmail(email);
    if (DeleteUserStatus.lastErrorObject.n === 0) {
      res.status(403).json({
        status: 'Fail',
        message: 'Unsuccessful deletion of user.',
      });
    } else {
      next();
    }
  } catch (error) {
    winstonInstance.error(error);
  }
};
module.exports = {
  getUsers,
  getUsersByEmail,
  addUser,
  filterUsers,
  updateUser,
  loginUser,
  deleteUser,
};
