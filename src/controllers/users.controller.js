const jwt = require('jsonwebtoken');
const {
  getUsersByEmail,
  addUsers,
  userAuthorization,
  updateUserByEmail,
  deleteUsersByEmail,
} = require('../config/dao');

const decodeJWT = (token) => {
  if (token) {
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
    return {};
  }
  return {};
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

// when we actually crack this all open
// https://www.npmjs.com/package/google-auth-library

// example of user JSON data you'd get from Admin SDK API directory w/ role management
// {
//   "roleId": string,
//   "roleName": string,
//   "roleDescription": string,
//   "rolePrivileges": [
//     {
//       "serviceId": string,
//       "privilegeName": string
//     }
//   ],
//   "isSystemRole": boolean,
//   "isSuperAdminRole": boolean,
//   "kind": string,
//   "etag": string
// }

const getUserRole = async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      res.status(200).json({
        status: 'Success',
        message: 'Dev is authorized',
        scope: 'admin',
      });
    }
    // token is called 'authorization' in headers
    const { authorization } = req.headers;
    // decode the token
    const decodedToken = decodeJWT(authorization);
    // verify this is in fact our user
    const { userFound, user } = await verifyUser(decodedToken);
    // check for role within token's JSON data
    const authorizationCheck = userAuthorization(decodedToken.roleName);
    // if this is our user and are authorized, proceed
    if (userFound && authorizationCheck) {
      res.status(200).json({
        status: 'Success',
        message: `${user} is authorized`,
        role: decodedToken.roleName,
      });
    }
  } catch {
    res.status(403).json({
      status: 'Failed',
      message: 'User not authorized',
    });
  }
};

const loginUser = async (req, res) => {
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

const getUsers = async (req, res) => {
  const { email } = req.query;
  const userSearchResults = await getUsersByEmail(email);
  if (userSearchResults.length > 0) {
    res.status(200).json({ status: 'Success', message: `User found with given email: ${email}`, user: userSearchResults });
  } else {
    res.status(403).json({ status: 'Failed', message: 'User Not Found', user: [] });
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.query;
  const userDeleteResults = await deleteUsersByEmail(email);
  if (userDeleteResults.lastErrorObject.n === 1) {
    res.status(200).json({ status: 'Success', message: `User found with given email: ${email}. has been deleted`, user: userDeleteResults.value });
  } else {
    res.status(403).json({ status: 'Failed', message: 'User Not Found', user: [] });
  }
};
module.exports = {
  loginUser, getUsers, getUserRole, deleteUser,
};
