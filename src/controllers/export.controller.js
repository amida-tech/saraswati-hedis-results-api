const fs = require('fs');
const process = require('process');
const excel = require('exceljs');

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
  const memberType = memberResults[0].measurementType

  cl("MemberId found within memberResult array! File name and path established.")
  cl("Member Results:", memberResults)
  cl("File name:", fileName)
  cl("Folder path:", folderPath)
  cl("Measurement type:", memberType)

  function injectTemplate() {
    return fs.copyFile(`${__root}/reports/member/templates/${memberType}.xlsx`,
      `${__root}${folderPath}/${fileName}`, (error) => {if (error) {throw error}}
    )
  }

  // CREATE FOLDER IF IT DOESN'T EXIST
  if (!fs.existsSync(`${__root}${folderPath}`)) {
    fs.mkdirSync(`${__root}${folderPath}`)
    injectTemplate()
    // CREATE FILE IF IT DOESN'T EXIST
  } else if (!fs.existsSync(`${__root}${folderPath}/fileName`)) {
    injectTemplate()
  }

  return next(memberType)

  // try {
  //   cl("Searching for:", `${__root}${folderPath}/${fileName}`)

  //   const status = await fs.promises.stat(`${__root}${folderPath}/${fileName}`, (error) => {
  //     if (error instanceof ReferenceError) {
  //       console.error("ERROR: Member report has error, regenerating file...", error);
  //       return false
  //     }
  //   })

  //   cl('the status:', status.ctime)
  //   next("MEMBER REPORT ALREADY EXISTS")

  // } catch (error) {
  //   if (error instanceof ReferenceError) {
  //     next("GENERATION ERROR:", error)
  //   } else {
  //     cl("Old or missing member data. Generating fresh member report...")
  //     generateMemberReport(memberResults[0], fileName);
  //     res.sendFile(`.${folderPath}/${fileName}`, { root: __root });
  //   }
  // }
};

module.exports = {
  generateTest,
  generateMemberById,
};
