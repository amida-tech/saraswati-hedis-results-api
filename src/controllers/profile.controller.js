const winstonInstance = require('../config/winston');
const dao = require('../config/dao');
const { userChangeFinder } = require('../utilities/userProfileUtils');

const getUserProfileByEmail = async (req, res, next) => {
  const { email } = req.query;
  try {
    const getUsersByEmail = await dao.getUsersByEmail(email);
    if (getUsersByEmail.length > 0) {
      req.foundUser = getUsersByEmail;
      next();
    } else {
      res.status(404).json({
        status: 'Failed',
        message: 'USER NOT FOUND',
      });
    }
  } catch (error) {
    winstonInstance.error(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    role,
    companyName,
    userPreferences,
  } = req.body;
  try {
    // User from DB from 'getUserProfileByEmail' middleware Above ^^^
    if (req.foundUser) {
      const { foundUser } = req;
      if (foundUser.length > 0) {
        const currentUserSettings = {
          email: email.toLowerCase(),
          firstName,
          lastName,
          role,
          companyName,
          userPreferences,
        };
        // should point to company refrence table in db later
        const companyWidePreferences = foundUser[0].companyPreferences;
        const {
          UpdatedUser,
          foundErrors,
        } = userChangeFinder(foundUser[0], currentUserSettings, companyWidePreferences);
        if (foundErrors.length > 0) {
          // REFRENCE for status Code ----> https://www.moesif.com/blog/technical/api-design/Which-HTTP-Status-Code-To-Use-For-Every-CRUD-App/
          res.status(204).json({
            status: 'Failed',
            message: 'UNABLE TO UPDATE USER',
          });
        } else {
          const updateUser = await dao.updateUserByEmail(UpdatedUser, email);
          req.updatedUser = updateUser;
          next();
        }
      } else {
        res.status(404).json({
          status: 'Failed',
          message: 'USER NOT FOUND',
        });
      }
    } else {
      res.status(404).json({
        status: 'Failed',
        message: 'USER NOT FOUND',
      });
    }
  } catch (error) {
    winstonInstance.error(error);
  }
};

module.exports = {
  getUserProfileByEmail,
  updateUserProfile,
};
