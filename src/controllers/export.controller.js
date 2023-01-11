/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const process = require('process');
const moment = require('moment');
const logger = require('../config/winston');

const { generateTestReport } = require('../exports/test-report');
const { generateMemberReport, injectTemplate } = require('../exports/member-report');
const dao = require('../config/dao');

const __root = process.cwd();

const generateTest = async () => {
  try {
    generateTestReport();
  } catch (error) {
    res.send('ERROR: Member report failed to generate within test', error);
  }
};

async function generateMemberById(req, res, next) {
  let memberResults = await dao.getMembers(req.query);
  memberResults = memberResults.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
  const fileName = `${memberResults[0].memberId}.xlsx`;
  const folderPath = `/reports/member/${memberResults[0].measurementType}`;

  logger.info(JSON.stringify(memberResults[0]));

  try {
    // IF FOLDER DOESN'T EXIST
    if (!fs.existsSync(`${__root}${folderPath}`)) {
      fs.mkdirSync(`${__root}${folderPath}`);
      await injectTemplate(memberResults[0], __root, folderPath, fileName);
      res.download(`${__root}${folderPath}/${fileName}`);

    // IF FILE DOESN'T EXIST
    } else if (!fs.existsSync(`${__root}${folderPath}/${fileName}`)) {
      injectTemplate(memberResults[0], __root, folderPath, fileName);
      res.download(`${__root}${folderPath}/${fileName}`);

    // IF FILE STRUCTURE ALREADY EXISTS
    } else {
      const status = await fs.promises.stat(`${__root}${folderPath}/${fileName}`);

      // IF REPORT IS NOT CURRENT
      if (moment(status.ctime).isSameOrBefore(moment().subtract(1, 'd'))) {
        await generateMemberReport(memberResults[0], fileName, folderPath);
        res.download(`${__root}${folderPath}/${fileName}`);

        // IF REPORT IS CURRENT
      } else {
        res.download(`${__root}${folderPath}/${fileName}`);
      }
    }
  } catch (error) {
    if (error instanceof ReferenceError) {
    } else if (error) {
      res.send(error);
    } else {
      res.end();
    }
  }
}

module.exports = {
  generateTest,
  generateMemberById,
};
