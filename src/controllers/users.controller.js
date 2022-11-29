const qs = require('qs');
const winstonInstance = require('../config/winston');
const dao = require("../config/dao")
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
  const { email } = req.params;
  try {
    const getUsersByEmail = await dao.getUsersByEmail(email);
    req.User = getUsersByEmail;
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
    email: email.toLowerCase(),
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
  }
  try {
    const addUser = await dao.addUsers(userToAdd);
    req.newUser = addUser;
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
      email: email.toLowerCase(),
      firstName,
      lastName,
      role,
      companyName,
      companyPreferences,
      userPreferences,
      created_on,
      updated_on :Date.now(),
      lastLogin,
      active,
    }
    const updateUser = await dao.updateUserByEmail(userToUpdate,email.toLowerCase());
    req.updatedUser = updateUser;
    next();
  } catch (error) {
    winstonInstance.error(error);
  }
};

const loginUser = async (req, res, next) => {
  const foundUserArray = req.User;
  if (foundUserArray.length === 1) {
    const foundUser = foundUserArray[0];
    foundUser.userPreferences.lastLogin = Date.now();
    foundUser.updated_on = Date.now();
    const updateUser = await dao.updateUserByEmail(foundUser);
    if (updateUser.length > 0) {
      const token = makeToken(foundUser);
      res.status(200).json({ message: `${foundUser.firstName} is back`, saraswatiToken: token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  }
};

function makeToken(user) {
  const payload = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
    companyPreferences: user.companyPreferences,
    userPreferences: user.userPreferences,
    created_on: user.created_on,
    updated_on: user.updated_on,
    active: user.active,
    lastLogin: user.lastLogin,
  };
  const options = {
    // TOKEN EXPIRATION 3hours in ms
    expiresIn: 10800000,
  };
    // secret in between  payload and options should be changed to env variable
  return jwt.sign(payload, 'I AM THE SECRET CHANGE ME LATER', options);
};

const filterUsers = async (req, res, next) => {
  const { email } = req.body
  try {
    if(email){
      const getUsersByEmail = await dao.getUsersByEmail(email.toLowerCase());
      if(getUsersByEmail.length === 0){
        next()
      } else {
        res.status(403).json({
          status: "Fail",
          message: "User already exist in database. Please check credentials."
        })
      }
    } else {
      res.status(400).json({
        status: "Fail",
        message: "Please an Email"
      })
    }
  } catch (error) {
    winstonInstance.error(error)
  }
};

module.exports = {
  getUsers,
  getUsersByEmail,
  addUser,
  filterUsers,
  updateUser,
  loginUser,
};
