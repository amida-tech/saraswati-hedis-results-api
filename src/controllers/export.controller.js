/* eslint-disable no-else-return */
const fs = require('fs');
const moment = require('moment');
const process = require('process');

const { generateTestReport } = require('../exports/test-report');
const { generateMemberReport } = require('../exports/member-report');
const dao = require('../config/dao');

// eslint-disable-next-line no-underscore-dangle
const __root = process.cwd();

const generateTest = async () => {
  try {
    generateTestReport();
  } catch (error) {
    return error;
  }
  return true;
};

// eslint-disable-next-line consistent-return
async function generateMemberById(req, res, next) {
  let memberResults = await dao.findMembers(req.query);
  memberResults = memberResults.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
  const fileName = `${memberResults[0].memberId}.xlsx`;
  const folderPath = `/reports/member/${memberResults[0].measurementType}`;
  const filePath = `${__root}${folderPath}/${fileName}`;

  res.set('Content-Disposition', `attachment; filename="${fileName}"`);
  try {
    const status = await fs.promises.stat(filePath, (error) => {
      if (error instanceof ReferenceError) {
        console.error('ERROR: Member report has error, regenerating file...', error);
        return false;
      }
      return true;
    });
    const validTime = moment().isSame(moment(status.ctime), 'day');
    if (validTime) {
      res.download(filePath);
    } else {
      generateMemberReport(memberResults[0], fileName);
      res.download(filePath);
    }
  } catch (error) {
    if (error instanceof ReferenceError) {
      next('GENERATION ERROR:', error);
    } else {
      generateMemberReport(memberResults[0], fileName);
      res.download(filePath);
      return next(`SUCCESS: Member report generated in location: ${folderPath}/${fileName}`);
    }
  }
}

module.exports = {
  generateTest,
  generateMemberById,
};
