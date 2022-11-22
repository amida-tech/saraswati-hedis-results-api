const axios = require('axios');
const qs = require('qs');
const winstonInstance = require('../config/winston');
const dao = require('../config/dao');
const { object } = require('joi');

const getUserProfileByEmail = async (req, res, next) => {
  const { email } = req.query;
  try {
    const getUsersByEmail = await dao.getUsersByEmail(email.toLowerCase());
    if(getUsersByEmail.length > 0){
      req.foundUser = getUsersByEmail;
      next();
    }else{
      res.status(400).json({
        status:'Failed',
        message: `No user preferences found by given email: ${email}`
      })
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
    userPrefrences,
  } = req.body;
  try {
    // User from DB from 'getUserProfileByEmail' middleware Above ^^^
    if(req.foundUser){
      const foundUser = req.foundUser
      if(foundUser.length > 0){
        const currentUserSettings = {
          email: email.toLowerCase(),
          firstName,
          lastName,
          role,
          companyName,
          userPrefrences,
        }
        const companyWidePrefrences = foundUser[0].companyPreferences // should point to company refrence table in db later
        const foundChangesToUpdate = userPrefrenceChangesFinder(foundUser[0], currentUserSettings, companyWidePrefrences)
        // const updateUser = await dao.updateUserByEmail(userToUpdate, email.toLowerCase());
        // req.updatedUser = updateUser;
        // next();
      
      } else {
        res.status(400).json({
          status:'Failed',
          message: `No user preferences found by given email: ${email}`
        })
      }
    } else {
      res.status(400).json({
        status:'Failed',
        message: `No user preferences found by given email: ${email}`
      })
    }
  } catch (error) {
    winstonInstance.error(error);
  }
};

const userPrefrenceChangesFinder = (oldPref, newPref, companyWidePrefrences) => {
  const timeStamp = Date.now()
  // console.log(newPreferences)
  // email
  // firstName
  // lastName
  // role
  // companyName
  // userPrefrences
  // Updated user Empty Obj
  const UpdatedUser = {}

  // PREVIOUS PROFILE UNEDITABLE  VVVVVV
  UpdatedUser._id = oldPref._id
  UpdatedUser.email = oldPref.email
  UpdatedUser.role = oldPref.role
  UpdatedUser.companyName = oldPref.companyName
  UpdatedUser.companyPreferences = oldPref.companyPreferences
  UpdatedUser.active = oldPref.active
  UpdatedUser.created_on = oldPref.created_on
  UpdatedUser.updated_on = timeStamp
  UpdatedUser.lastLogin = oldPref.lastLogin
 // PREVIOUS PROFILE UNEDITABLE  ^^^^^^^


  // Editable items for Users - First Name
  let firstName = ''
  if (newPref.firstName === oldPref.firstName ){
    firstName = oldPref.firstName
  } else if (newPref.firstName === '') {
    firstName = oldPref.firstName
  } else {
    firstName = newPref.firstName
  }
  UpdatedUser.firstName = firstName

  // Editable items for Users - Last Name

  let lastName = ''
  if (newPref.lastName === oldPref.lastName ){
    lastName = oldPref.lastName
  } else if (newPref.lastName === '') {
    lastName = oldPref.lastName
  } else {
    lastName = newPref.lastName
  }
  UpdatedUser.lastName = lastName

  let userPrefrences = {}

  const changedPrefsKeys_NonObjects = Object.keys(oldPref.userPrefrences).filter((key) => {
    if(typeof oldPref.userPrefrences[key] !== 'object'){
      if(oldPref.userPrefrences[key] !== newPref.userPrefrences[key]){
        return key
      }
    }
  })
  const changedPrefsKeys = Object.keys(oldPref.userPrefrences).filter((key) => {
    if(typeof oldPref.userPrefrences[key] == 'object'){
      if(JSON.stringify(oldPref.userPrefrences[key]) !== JSON.stringify(newPref.userPrefrences[key])) {
        return key
      }
    }
  })
  // 
  if(changedPrefsKeys_NonObjects.length > 0) {
    const allPrefsKeys_NonObjects = Object.keys(oldPref.userPrefrences).filter((key) => {
      if(typeof oldPref.userPrefrences[key] !== 'object'){
          return key
      }
    })
    const untouchedPrefrences_NonObjects = allPrefsKeys_NonObjects.filter((pref) => !changedPrefsKeys_NonObjects.includes(pref))
    for(let i = 0; i < changedPrefsKeys_NonObjects.length; i += 1){
      userPrefrences[changedPrefsKeys_NonObjects[i]] = newPref.userPrefrences[changedPrefsKeys_NonObjects[i]]
    }
    if (untouchedPrefrences_NonObjects.length > 0){
      for(let i = 0; i < untouchedPrefrences_NonObjects.length; i += 1){
        userPrefrences[untouchedPrefrences_NonObjects[i]] = oldPref.userPrefrences[untouchedPrefrences_NonObjects[i]]
      }
    }
  }

  if(changedPrefsKeys.length > 0){
    const allPrefsKeys = Object.keys(oldPref.userPrefrences).filter((key) => {
      if(typeof oldPref.userPrefrences[key] == 'object'){
          return key
      }
    })
    const untouchedPrefrences = allPrefsKeys.filter((pref) => !changedPrefsKeys.includes(pref))
    for(let i = 0; i < changedPrefsKeys.length; i += 1){
      userPrefrences[changedPrefsKeys[i]] = newPref.userPrefrences[changedPrefsKeys[i]]
    }
    if (untouchedPrefrences.length > 0){
      for(let i = 0; i < untouchedPrefrences.length; i += 1){
        userPrefrences[untouchedPrefrences[i]] = oldPref.userPrefrences[untouchedPrefrences[i]]
      }
    }
  }

  UpdatedUser.userPrefrences = userPrefrences
  console.log(UpdatedUser.userPrefrences)
  return UpdatedUser
}
 
module.exports = {
  getUserProfileByEmail,
  updateUserProfile,
};
