/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const process = require('process');
const moment = require('moment');
const logger = require('../config/winston');

const { generateTestReport } = require('../exports/test-report');
const { generateMemberReport, injectTemplate } = require('../exports/member-report');
const { calcLatestNumDen } = require('../calculators/NumDenCalculator');
const { qrda3Export } = require('../exports/qrda-3-report');
const { createInfoObject } = require('../utilities/infoUtil');
const dao = require('../config/dao');

const __root = process.cwd();

const generateTest = async () => {
  try {
    generateTestReport();
  } catch (error) {
    res.send('ERROR: Member report failed to generate within test', error);
  }
};

async function generateMemberById(req, res) {
  let memberResults = await dao.findMembers(req.query);
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
      // This space left blank intentionally
    } else if (error) {
      res.send(error);
    } else {
      res.end();
    }
  }
}

const qrda3 = async (req, res, next) => {
  try {
    let patientResults = [];
    if (req.query.measurementType === 'composite') {
      patientResults = await dao.findMembers({});
    } else {
      patientResults = await dao.findMembers(req.query);
    }

    if (patientResults.length === 0) {
      return res.send([]);
    }

    const infoList = await dao.findInfo();
    const measureInfo = createInfoObject(infoList);

    const dailyMeasureResults = calcLatestNumDen(patientResults, measureInfo, new Date());

    let reportInfo = {};
    let practitioners = [];
    if (req.query.measurementType === 'composite') {
      reportInfo = dailyMeasureResults[dailyMeasureResults.length - 1];
      practitioners = await dao.getPractitioners();
    } else {
      // eslint-disable-next-line prefer-destructuring
      reportInfo = dailyMeasureResults[0];
      patientResults.forEach((patientResult) => {
        patientResult.providers.forEach((provider) => {
          if (provider.reference.startsWith('Practitioner') && !practitioners.find((prac) => prac.value === provider.reference)) {
            practitioners.push({
              practitioner: provider.display,
              value: provider.reference,
            });
          }
        });
      });
    }
    const qrdaReport = qrda3Export(reportInfo, measureInfo, practitioners);
    return res.send(qrdaReport);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  generateTest,
  generateMemberById,
  qrda3,
};
