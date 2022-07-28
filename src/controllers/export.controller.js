/* eslint-disable no-else-return */
const fs = require('fs');
const process = require('process');
const moment = require('moment');

const { generateTestReport } = require('../exports/test-report');
const { generateMemberReport } = require('../exports/member-report');
const dao = require('../config/dao');
const { response } = require('express');
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
  const memberType = memberResults[0].measurementType

  async function injectTemplate() {
    return fs.copyFile(`${__root}/reports/member/templates/${memberType}.xlsx`,
      `${__root}${folderPath}/${fileName}`, (error) => {if (error) {console.log('lmao', error)}}
    )
  }

  try {
    // IF FOLDER DOESN'T EXIST
    if (!fs.existsSync(`${__root}${folderPath}`)) {
      fs.mkdirSync(`${__root}${folderPath}`)
      await injectTemplate()
      await generateMemberReport(memberResults[0], fileName, folderPath);
      console.log(1)
      res.download(`${__root}${folderPath}/${fileName}`)
      return true
    // IF FILE DOESN'T EXIST
    } else if (!fs.existsSync(`${__root}${folderPath}/${fileName}`)) {
      await injectTemplate()
      await generateMemberReport(memberResults[0], fileName, folderPath);
      console.log(2)
      res.download(`${__root}${folderPath}/${fileName}`)
      return true
    // IF FILE STRUCTURE ALREADY EXISTS
    } else {
      const status = await fs.promises.stat(`${__root}${folderPath}/${fileName}`)
      // IF REPORT IS NOT CURRENT
      if (moment(status.mtime).isSameOrBefore(moment().subtract(1, 'd'))) {
        await generateMemberReport(memberResults[0], fileName, folderPath);
        console.log(4)
        res.download(`${__root}${folderPath}/${fileName}`)
        return true
      } else {
        // IF REPORT IS CURRENT
        console.info(`Report already current/exists. Current report located at: ${__root}${folderPath}/${fileName}`)
        console.log(5)
        res.download(`${__root}${folderPath}/${fileName}`)
        return true
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
    // If the file can't be found, generate a new one and serve.
  } catch (error) {
    console.log(8);
    next('GENERATION ERROR:', error);
  }
};

module.exports = {
  generateTest,
  generateMemberById,
};
