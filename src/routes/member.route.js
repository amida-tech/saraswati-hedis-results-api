const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('../config/param-validation');
const memberCtrl = require('../controllers/member.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get(memberCtrl.getMembers);

router.route('/paginate').post(memberCtrl.paginateMembers);

if (process.env.NODE_ENV !== 'production') {
  router.route('/').post(memberCtrl.postMember);
  router.route('/bulk').post(memberCtrl.postBulkMembers);
}

router.route('/info')
  .get(validate(paramValidation.memberInfo), memberCtrl.getMemberInfo);

router.route('/search')
  .get(memberCtrl.searchMembers);

module.exports = router;
