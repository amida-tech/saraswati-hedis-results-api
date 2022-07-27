const dao = require('../config/dao');
const { queryBuilder } = require('../utilities/filterDrawerUtils');

const filterMembersDBStyle = async (req, res, next) => {
  const { submeasure, filters, isComposite } = req.body;
  const { searchQuery } = queryBuilder(submeasure, filters, isComposite);

  try {
    const Members = await dao.findMembers(searchQuery);
    req.FoundMembers = Members;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  filterMembersDBStyle,
};
