const logger = require('../config/winston');
const dao = require('../config/dao');

const getUsers = async (req, res, next) => {
  try {
    const allUsers = await dao.getUsers();
    req.Users = allUsers;
    next();
  } catch (error) {
    logger.error(error);
  }
};

const getUsersByEmail = async (req, res, next) => {
  const { email } = req.query;
  try {
    const userByEmail = await dao.getUsersByEmail(email);
    req.User = userByEmail;
    next();
  } catch (error) {
    logger.error(error);
  }
};

const getRoleByEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const role = await dao.getRoleByEmail(email);
    if (role.length > 0) {
      req.role = role;
      next();
    } else {
      res.status(404).json({
        status: 'Failed',
        message: 'USER NOT FOUND',
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

const addUser = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    region,
    role,
    userGroup,
    picture,
    companyName,
    companyPreferences,
    userSettings,
    userPreferences,
    userHistory,
  } = req.body;
  const userToAdd = {
    email,
    firstName,
    lastName,
    region,
    role,
    userGroup,
    picture,
    companyName,
    companyPreferences,
    userSettings,
    userPreferences,
    userHistory,
    created_on: new Date(Date.now()),
    lastUpdated: new Date(Date.now()),
    lastLogin: new Date(Date.now()),
    active: true,
  };
  try {
    const addedUser = await dao.addUsers(userToAdd);
    req.newUser = addedUser;
    next();
  } catch (error) {
    logger.error(error);
  }
};

const updateUser = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    region,
    role,
    userGroup,
    picture,
    companyName,
    companyPreferences,
    userSettings,
    userPreferences,
    userHistory,
    created_on,
    lastLogin,
    active,
  } = req.body;
  try {
    const userToUpdate = {
      email,
      firstName,
      lastName,
      region,
      role,
      userGroup,
      picture,
      companyName,
      companyPreferences,
      userSettings,
      userPreferences,
      userHistory,
      created_on,
      lastUpdated: new Date(Date.now()),
      lastLogin,
      active,
    };

    const updatedUser = await dao.updateUserByEmail(userToUpdate, email);
    req.updatedUser = updatedUser;

    next();
  } catch (error) {
    logger.error(error);
  }
};

const loginUser = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    region,
    role,
    userGroup,
    picture,
    companyName,
    companyPreferences,
    userSettings,
    userPreferences,
    userHistory,
    created_on,
    active,
  } = req.User;
  // const token = req.body.tokenGiven;
  try {
    const userToUpdate = {
      email,
      firstName,
      lastName,
      region,
      role,
      userGroup,
      picture,
      companyName,
      companyPreferences,
      userSettings,
      userPreferences,
      userHistory,
      created_on,
      lastUpdated: new Date(Date.now()),
      lastLogin: new Date(Date.now()),
      active,
    };
    const updatedUser = await dao.updateUserByEmail(userToUpdate, email);
    req.updatedUser = updatedUser;
    next();
  } catch (error) {
    logger.error(error);
  }
};

const filterUsers = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (email) {
      const UsersFound = await dao.getUsersByEmail(email);
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
    logger.error(error);
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
    logger.error(error);
  }
};
module.exports = {
  getUsers,
  getUsersByEmail,
  getRoleByEmail,
  addUser,
  filterUsers,
  updateUser,
  loginUser,
  deleteUser,
};
