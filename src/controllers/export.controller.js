const { generateTestReport } = require('../exports/test-report');
const { generateMemberReport } = require('../exports/member-report');
const dao = require('../config/dao');

const generateTest = async () => {
  try {
    generateTestReport();
  } catch (e) {
    console.log(e);
  }
};

// const generateMemberById = async () => {
//   console.log('ITT we work now');
// };

const generateMemberById = async (req, res, next) => {
  try {
    let memberResults = await dao.findMembers(req.query);
    memberResults = memberResults.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
    generateMemberReport(memberResults[0]);
    return res.send(memberResults[0]);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  generateTest,
  generateMemberById,
};
