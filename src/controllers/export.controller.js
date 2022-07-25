const fs = require('fs');
const moment = require('moment');
const process = require('process');

const { generateTestReport } = require('../exports/test-report');
const { generateMemberReport } = require('../exports/member-report');
const dao = require('../config/dao');
const __root = process.cwd();
const cl = console.log

const generateTest = async () => {
  try {
    generateTestReport();
  } catch (error) {
    return next("ERROR: Member report failed to generate within test", error);
  }
};

async function generateMemberById(req, res, next) {
  cl('Preparing to generate report...')
  let memberResults = await dao.findMembers(req.query);
  memberResults = memberResults.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
  const fileName = `${memberResults[0].memberId}.xlsx`;
  const folderPath = `/reports/member/${memberResults[0].measurementType}`;
  cl("MemberId found within memberResult array! File name and path established.")

  try {
    cl("Searching for:", `${__root}${folderPath}/${fileName}`)

    const status = await fs.promises.stat(`${__root}${folderPath}/${fileName}`, (error) => {
      if (error instanceof ReferenceError) {
        console.error("ERROR: Member report has error, regenerating file...", error);
        return false
      }
    })

    cl('the status:', status.ctime)
    next("MEMBER REPORT ALREADY EXISTS")

  } catch (error) {
    if (error instanceof ReferenceError) {
      next("GENERATION ERROR:", error)
    } else {
      cl("Old or missing member data. Generating fresh member report...")
      generateMemberReport(memberResults[0], fileName);
      res.sendFile(`.${folderPath}/${fileName}`, { root: __root });
      return next(`SUCCESS: Member report generated in location: ${folderPath}/${fileName}`)
    }
  }
};

module.exports = {
  generateTest,
  generateMemberById,
};
