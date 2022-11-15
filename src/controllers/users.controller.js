const { googleClientID, googleClientSecret, googleOAuthRedirectUrl } = require("../config/config")
const axios = require('axios')
const qs = require('qs')
const winstonInstance = require("../config/winston")
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
    try {
        const allUsers = await dao.getUsers()
        req.Users = allUsers
        next()
    } catch (error) {
        winstonInstance.error(error)

    }
 
}
const getUsersByID = async (req, res, next) => {
    const { id } = req.params
    try {
        const getUserByID = await dao.getUserByID(id)
        req.User = getUserByID
        next()
    } catch (error) {
        winstonInstance.error(error)

    }
}
const getUsersByEmail = async (req, res, next) => {
    const { email } = req.body
    try {
        const getUsersByEmail = await dao.getUsersByEmail(email.toLowerCase())
        req.User = getUsersByEmail
        next()
    } catch (error) {
        winstonInstance.error(error)
    }
}
const addUser = async (req, res, next) => {
    const { 
        email,
        firstName,
        lastName,
        role,
        companyName,
        companyPreference,
        userPrefrences,
        created_on,
        updated_on,
        active,
    } = req.body
    try {
        const addUser = await dao.addUsers({
            email: email.toLowerCase(),
            firstName,
            lastName,
            role,
            companyName,
            companyPreference,
            userPrefrences,
            created_on,
            updated_on,
            active,
        })
        req.newUser = addUser
        next()
    } catch (error) {
        winstonInstance.error(error)
    }
}
const updateUser = async (req, res, next) => {
    const { id } = req.params
    const { 
        email,
        firstName,
        lastName,
        role,
        companyName,
        companyPreference,
        userPrefrences,
        created_on,
        updated_on,
        active,
    } = req.body
    try {
        const updateUser = await dao.updateUser({
            email: email.toLowerCase(),
            firstName,
            lastName,
            role,
            companyName,
            companyPreference,
            userPrefrences,
            created_on,
            updated_on,
            active,
        }, id)
        req.updatedUser = updateUser
        next()
    } catch (error) {
        winstonInstance.error(error)
    }
}
const disableUser = async (req, res, next) => {
    const { id } = req.params
    const { 
        email,
        firstName,
        lastName,
        role,
        companyName,
        companyPreference,
        userPrefrences,
        created_on,
        updated_on,
        active,
    } = req.body
    try {
        const updateUser = await dao.updateUser({
            email: email.toLowerCase(),
            firstName,
            lastName,
            role,
            companyName,
            companyPreference,
            userPrefrences,
            created_on,
            updated_on: Date.now(),
            active: false,
        }, id)
        req.updatedUser = updateUser
        next()
    } catch (error) {
        winstonInstance.error(error)
    }
}
const accessControl = async (req, res, next) => {
    const { email } = req.body
    console.log({req})
    const selectUser = await dao.getUsersByEmail(email.toLowerCase())
    if(selectUser.length > 0 ){
        console.log({ accessControl: selectUser })
        const selectUserFound = selectUser[0]
        if (selectUserFound.role.toLowerCase().includes('admin')) {
            req.verifiedUser = selectUserFound
            next()
        } else {
            // 403 means that the user is known but not authorized (i.e. doesn't have the proper role/group)
            res.status(403).json({ message:'You are not a authorized for this feature please check with your admin.' })
        }
    } else {
        // 401 means that the user is unknown (not authenticated at all or authenticated incorrectly, e.g. the credentials are invalid)
        res.status(401).json({ message:'You are not a member' })
    }
}
const loginUser = async (req,res,next) => { 
    const foundUserArray = req.User
    if (foundUserArray.length === 1){
        const foundUser = foundUserArray[0]
        foundUser.userPrefrences.lastLogin = Date.now()
        foundUser.updated_on = Date.now()
        const updateUser = await dao.updateUser(foundUser, foundUser._id)
        if(updateUser.length > 0 ){
            const token = makeToken(foundUser);
            res.status(200).json({ message: `${foundUser.firstName} is back`, saraswatiToken: token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });

        }
    }
}
function makeToken(user) {
	const payload = {
		id: user._id,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		role: user.role,
        companyName: user.companyName,
        companyPreference: user.companyPreference,
        userPrefrences: user.userPrefrences,
        created_on: user.created_on,
        updated_on: user.updated_on,
        active: user.active,
	};
	const options = {
        // 3hours in ms
		expiresIn: 10800000,
	};
	return jwt.sign(payload, googleClientSecret, options);
}
module.exports = {
    getUsers,
    getUsersByID,
    getUsersByEmail,
    addUser,
    updateUser,
    disableUser,
    accessControl,
    loginUser,
}