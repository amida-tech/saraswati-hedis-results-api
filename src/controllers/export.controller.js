const fs = require('fs');
const moment = require('moment');
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
    const fileName = `${memberResults[0].memberId}.xlsx`;
    const folderPath = `./reports/member/${memberResults[0].measurementType}`;
    console.log(`../${__dirname}`);
    console.log(1);
    fs.stat(folderPath, (error, stats) => {
      console.log(2);
      if (error) {
        console.log(3);
        return error;
      }
      if (!stats || moment(stats.mtime).isSameOrAfter(moment(), 'day')) {
        console.log(4);
        generateMemberReport(memberResults[0], fileName);
      }
      console.log(5);
      return true;
    });
    console.log(6);
    return res.sendFile(`${folderPath}/${fileName}`, { root: __dirname });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  generateTest,
  generateMemberById,
};
