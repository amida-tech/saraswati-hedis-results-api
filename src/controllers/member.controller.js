/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

const getMembers = async (req, res, next) => {
  try {
    const measures = await dao.findMembers(req.query);
    return res.send(measures);
  } catch (e) {
    return next(e)
  }
};

// Get all records with the memberId, sort and get the latest one
const getMemberInfo = async (req, res, next) => {
  try {
    let memberResults = await dao.findMembers(req.query);
    memberResults = memberResults.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
    return res.send(memberResults[0]);
  } catch (e) {
    return next(e)
  }
};

const postBulkMembers = async (req, res, next) => {
  try {
    const options = { ordered: true };
    const measures = await dao.insertMembers(req.body, options);
    return res.send(measures);
  } catch (e) {
    return next(e)
  }
};

const postMember = async (req, res, next) => {
  try {
    const measure = await dao.insertMember(req.body);
    return res.send(measure);
  } catch (e) {
    return next(e)
  }
};

const searchMembers = async (req, res, next) => {
  try {
    // return res.send(req.query)
    let memberResults = await dao.searchMembers(req.query);
    return res.send(memberResults)
  } catch (e) {
    return next(e)
  }
}

module.exports = {
  getMembers,
  getMemberInfo,
  postBulkMembers,
  postMember,
  searchMembers
};
