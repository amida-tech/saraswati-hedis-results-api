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

// Finds member by ID and returns the Excel file via express.
// Conditionally generates new doc if file is from a different day.
// eslint-disable-next-line consistent-return
async function generateMemberById(req, res, next) {
  // Query for member
  let memberResults = await dao.findMembers(req.query);
  // Determine file nomenclature
  memberResults = memberResults.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
  const fileName = `${memberResults[0].memberId}.xlsx`;
  const folderPath = `/reports/member/${memberResults[0].measurementType}`;
  const filePath = `${__root}${folderPath}/${fileName}`;

  try {
    // Get existing file metadata
    console.log(1);
    console.log(filePath);
    const status = await fs.promises.stat(filePath, (error) => {
      console.log(2);
      // If file has error return, error.
      if (error instanceof ReferenceError) {
        console.log(3);
        console.error('ERROR: Member report has error, regenerating file...', error);
        return false;
      }
      console.log(4);
      return true;
    });
    // Time check
    console.log(5);
    const validTime = moment().isSame(moment(status.mtime), 'day');
    if (validTime) {
      console.log(6);
      res.download(filePath);
      return true;
    } else {
      console.log(7);
      generateMemberReport(memberResults[0], fileName);
      res.download(filePath);
      return true;
    }
    // If the file can't be found, generate a new one and serve.
  } catch (error) {
    console.log(8);
    next('GENERATION ERROR:', error);
  }
}

module.exports = {
  generateTest,
  generateMemberById,
};
