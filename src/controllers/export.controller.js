const fs = require('fs');
const process = require('process');
const moment = require('moment');

const { generateTestReport } = require('../exports/test-report');
const { generateMemberReport } = require('../exports/member-report');
const { generateAabReport } = require('../exports/aab-report');
const dao = require('../config/dao');
const { response } = require('express');
const __root = process.cwd();

const generateTest = async () => {
  try {
    generateTestReport();
  } catch (error) {
    return next("ERROR: Member report failed to generate within test", error);
  }
};

async function generateMemberById(req, res, next) {
  let memberResults = await dao.findMembers(req.query);
  memberResults = memberResults.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
  const fileName = `${memberResults[0].memberId}.xlsx`;
  const folderPath = `/reports/member/${memberResults[0].measurementType}`;
  const memberType = memberResults[0].measurementType

  async function injectTemplate() {
    return fs.copyFile(`${__root}/reports/member/templates/${memberType}.xlsx`,
      `${__root}${folderPath}/${fileName}`, (error) => {if (error) {console.log('lmao', error)}}
    )
  }

  async function populateData() {
    memberType === "aab" ? generateAabReport(memberResults[0], fileName) : generateMemberReport(memberResults[0], fileName, folderPath);
    res.sendFile(`.${folderPath}/${fileName}`, { root: __root });
  }

  try {
    if (!fs.existsSync(`${__root}${folderPath}`)) {
      fs.mkdirSync(`${__root}${folderPath}`)
      await injectTemplate()
      await populateData()
      return console.info(`Report generated. New report located at: ${__root}${folderPath}/${fileName}`)
      res.end()
    } else if (!fs.existsSync(`${__root}${folderPath}/${fileName}`)) {
      await injectTemplate()
      await populateData()
      console.info(`Report generated. New report located at: ${__root}${folderPath}/${fileName}`)
      res.end()
    } else {
      const status = await fs.promises.stat(`${__root}${folderPath}/${fileName}`)
      if (moment(status.mtime).isSameOrBefore(moment().subtract(1, 'd'))) {
        await populateData()
        console.info(`Report generated. New report located at: ${__root}${folderPath}/${fileName}`)
        res.end()
      } else {
        console.info(`Report already current/exists. Current report located at: ${__root}${folderPath}/${fileName}`)
        res.end()
      }
    }
  } catch (error) {
    if (error instanceof ReferenceError) {
      console.info("Member data generation failed via Reference Error:", error)
    } else if (error) {
      console.info("Member data had unexpected error:", error)
    } else {
      res.end()
    }
  }

};

module.exports = {
  generateTest,
  generateMemberById,
};
