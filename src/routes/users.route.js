const express = require('express');

const router = express(); // eslint-disable-line new-cap
const { 
    accessControl,
    getUsers,
    getUsersByID,
    getUsersByEmail,
    addUser,
    updateUser,
    disableUser,
    loginUser,
} = require('../controllers/users.controller');


router.get('/', accessControl, getUsers, (req, res) => {
    const users = req.Users
    const selectUserFound = req.verifiedUser 

})
router.get('/:id', getUsersByID, (req, res) => {})
router.post('/email', getUsersByEmail, (req, res) => {})


router.post('/update/:id', updateUser, (req, res) => {})
router.post('/delete/:id', disableUser, (req, res) => {})

router.post('/register', addUser, (req, res) => {})
router.post('/login', accessControl, getUsersByEmail, loginUser, (req, res) => {})




module.exports = router;











// const googleToken = 
//   if(googleToken) {
//   //   const {
//   //   iss,
//   //   nbf,
//   //   aud,
//   //   sub,
//   //   hd,
//   //   email,
//   //   email_verified,
//   //   azp,
//   //   name,
//   //   picture,
//   //   given_name,
//   //   family_name,
//   //   iat,
//   //   exp,
//   //   jti,
//   // } = dog

//   // const thisdoohicky = {
//   //   'iss': 'https://accounts.google.com',
//   //   'nbf': 1667862458,
//   //   'aud': '37027199173-0gh5tlrq64rjq9m08aanca4j7a4jjq5i.apps.googleusercontent.com',
//   //   'sub': '116996689466104277176',
//   //   'hd': 'amida.com',
//   //   'email': 'tim.jackreece@amida.com',
//   //   'email_verified': true,
//   //   'azp': '37027199173-0gh5tlrq64rjq9m08aanca4j7a4jjq5i.apps.googleusercontent.com',
//   //   'name': 'Tim Jackreece',
//   //   'picture': 'https://lh3.googleusercontent.com/a/ALm5wu0ad7wF4Z_9Mhd5gE4FWD6mnysZGYvJy2gGp57w=s96-c',
//   //   'given_name': 'Tim',
//   //   'family_name': 'Jackreece',
//   //   'iat': 1667862758,
//   //   'exp': 1667866358,
//   //   'jti': '4b43b0d6abfd0d046faf88b1fdb1dd38f177a38a'
//   // }
// //   const profilePref = {
// // profilePicture: picture,
// // firstName:given_name, serialize
// // lastName:family_name, serialize
// // Email: email, identifyer
// // companyProfile: '' still loking for more insight
// // companyName: hd,
// // category:
// // role: 
// // recentActivity:
// // measuresList:
// // organization_Team:
// // time:
// // language:
// // dark_Light_Mode:
// // active: bool
// //   }
//   }
//   const newPerson = {
//     firstName:123,
//     lastName:123,
//     email:123,
//     profilePicture:123,
//     companyName:123,
//     // role:user,
//     // :123,
//     memberSize:123,
//     accessControl:123,
//     lastLogin: '12/31/22',
//     recentActivity: []
//   }