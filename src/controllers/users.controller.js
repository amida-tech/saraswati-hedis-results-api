const jwt = require('jsonwebtoken');
const {
  getUsersByEmail,
  addUsers,
  updateUserByEmail,
} = require('../config/dao');

const decodeJWT = (token) => {
  const {
    iss,
    aud,
    hd,
    email,
    picture,
    given_name,
    family_name,
  } = jwt.decode(token);

  if (iss.includes('google')) {
    const loginThisUser = {
      clientID: aud,
      email,
      firstName: given_name,
      lastName: family_name,
      picture,
      companyDomain: hd,
    };
    return loginThisUser;
  }
};

const verifyUser = async (user) => {
  const userSearchResults = await getUsersByEmail(user.email);
  if (userSearchResults.length > 0) {
    return { userFound: true, user: userSearchResults };
  }
  return { userFound: false, user: [] };
};

const updateVerifiedUser = async (userDetails, UserInDB) => {
  const selectUser = UserInDB.find((user) => user.email === userDetails.email);
  selectUser.lastUpdated = new Date(Date.now());
  selectUser.lastLogin = new Date(Date.now());
  const updateStatus = await updateUserByEmail(selectUser, selectUser.email);
  if (updateStatus.ok === 1) {
    return true;
  }
  return false;
};

const addNewUser = async (tokenInfo) => {
  const {
    clientID,
    email,
    firstName,
    lastName,
    picture,
    companyDomain,
  } = tokenInfo;

  const newUser = {
    email,
    clientID,
    firstName,
    lastName,
    role: 'User',
    userGroup: 'General',
    picture,
    companyDomain,
    created_on: new Date(Date.now()),
    lastUpdated: new Date(Date.now()),
    lastLogin: new Date(Date.now()),
    active: true,
  };

  const newUserStatus = await addUsers(newUser);
  const { insertedCount } = newUserStatus;
  if (insertedCount === 1) {
    return true;
  }
  return false;
};

const loginUser = async (req, res, next) => {
  const { token } = req.body;
  //   decodeToken
  const decodedUser = decodeJWT(token);
  //   Verfy User
  const { userFound, user } = await verifyUser(decodedUser);
  //   If User Exist, update user's "lastUpdated", "lastLogin"
  if (userFound) {
    const updateTimesStatus = updateVerifiedUser(decodedUser, user);
    if (updateTimesStatus) {
      res.status(200).json({
        status: 'Success',
        message: 'Successful Login. Welcome Back!',
      });
    } else {
      res.status(403).json({
        status: 'Failed',
        message: 'Login Failed',
      });
    }
  } else {
    // If User Does NOT Exist, ADD USER
    const addStatus = addNewUser(decodedUser);
    if (addStatus) {
      res.status(200).json({
        status: 'Success',
        message: 'Successful Login. Welcome!',
      });
    } else {
      res.status(403).json({
        status: 'Failed',
        message: 'Login Failed',
      });
    }
  }
};

module.exports = { loginUser };
