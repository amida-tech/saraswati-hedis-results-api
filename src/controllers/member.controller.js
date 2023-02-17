/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
const dao = require('../config/daoFactory').getDao();
const { queryBuilder } = require('../utilities/filterDrawerUtils');

const getMembers = async (req, res, next) => {
  try {
    const measures = await dao.findMembers(req.query);
    return res.send(measures);
  } catch (e) {
    return next(e);
  }
};

const paginateMembers = async (req, res, next) => {
  const { measurementType } = req.query;
  const { filters } = req.body;
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);

  const { searchQuery } = queryBuilder(measurementType || false, filters);

  const skip = size * page;
  const limit = size;

  try {
    const { members } = await dao.paginateMembers(searchQuery, skip, limit);
    const membersByMeasure = await dao.findMembers(searchQuery);
    return res.send({
      Members: members,
      rowCount: members.length,
      totalCount: membersByMeasure.length,
      page,
    });
  } catch (error) {
    return next(error);
  }
};
// Get all records with the memberId, sort and get the latest one
const getMemberInfo = async (req, res, next) => {
  try {
    let memberResults = await dao.searchMembers(req.query);
    memberResults = memberResults.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
    return res.send(memberResults[0]);
  } catch (e) {
    return next(e);
  }
};

const postBulkMembers = async (req, res, next) => {
  try {
    const options = { ordered: true };
    const measures = await dao.insertMembers(req.body, options);
    return res.send(measures);
  } catch (e) {
    return next(e);
  }
};

const postMember = async (req, res, next) => {
  try {
    const measure = await dao.insertMember(req.body);
    return res.send(measure);
  } catch (e) {
    return next(e);
  }
};

const searchMembers = async (req, res, next) => {
  try {
    const memberResults = await dao.searchMembers(req.query);
    return res.send(memberResults);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getMembers,
  getMemberInfo,
  paginateMembers,
  postBulkMembers,
  postMember,
  searchMembers,
};
