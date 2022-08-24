/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
const fs = require('fs');
const process = require('process');
const moment = require('moment');
const excel = require('exceljs');

async function generateMemberReport(memberObj, fileName, folderPath) {
  const __root = process.cwd();
  const workbook = new excel.Workbook();
  const measure = memberObj.measurementType;

  try {
    // GET WORKBOOK
    await workbook.xlsx.readFile(`${__root}${folderPath}/${fileName}`);

    // DEFINING WORKSHEETS
    const generalWorksheet = workbook.getWorksheet('General');

    const measureWorksheet = workbook.getWorksheet('measure');
    measureWorksheet.name = measure;

    // MEMBER DATA TO INSERT
    const coverageObj = memberObj.coverage[0];
    const planDates = `${coverageObj.period.start.value} to ${coverageObj.period.end.value}`;
    const memberInfo = memberObj[memberObj.memberId];

    const dateFormatter = (date) => {
      const res = date.split('-');
      return [res[1], res[2], res[0]].join('/');
    };

    // SETTING BASIC WORKBOOK INFO
    workbook.creator = 'Saraswati Automatic Export';
    workbook.lastModifiedBy = 'Saraswati Automatic Export';
    workbook.created = new Date();
    workbook.modified = new Date();

    // GENERAL TAB: MEMBER INFO
    const lastUpdated = generalWorksheet.getCell('C1');
    lastUpdated.value = moment(new Date()).format('MM/DD/YYYY');
    const header = generalWorksheet.getCell('A3');
    header.value = `Member ${coverageObj.id.value || undefined} Analysis Report ${planDates || 'undetermined dates'}`;
    const subheader = generalWorksheet.getCell('A5');
    subheader.value = `This report is a summary of member ${coverageObj.id.value || undefined}'s measure records and analysis of data from ${planDates || undefined} as pulled from the Saraswati platform.`;

    const memberId = generalWorksheet.getCell('A9');
    memberId.value = memberObj.memberId || undefined;
    const dob = generalWorksheet.getCell('B9');
    dob.value = coverageObj.dob || '0/0/00';
    const age = generalWorksheet.getCell('C9');
    age.value = coverageObj.age || undefined;
    const gender = generalWorksheet.getCell('D9');
    gender.value = coverageObj.gender || undefined;
    const coverageStatus = generalWorksheet.getCell('E9');
    coverageStatus.value = coverageObj.status.value || undefined;

    // ACTIVE AND INACTIVE STYLING
    if (coverageStatus.value === 'active') {
      coverageStatus.font = { color: { argb: '1AC93D' }, bold: true };
    } else {
      coverageStatus.font = { color: { argb: 'C91A1A' }, bold: true };
    }

    const applicableMeasures = generalWorksheet.getCell('F9');
    applicableMeasures.value = memberObj.applicableMeasures || 1;
    const participationStart = generalWorksheet.getCell('G9');
    participationStart.value = dateFormatter(coverageObj.period.start.value) || undefined;
    const participationEnd = generalWorksheet.getCell('H9');
    participationEnd.value = dateFormatter(coverageObj.period.end.value) || undefined;

    // GENERAL TAB: POLICY INFO: THE DATA
    const policyId = generalWorksheet.getCell('A13');
    policyId.value = coverageObj.id?.value || undefined;
    const payorProvider = generalWorksheet.getCell('B13');
    payorProvider.value = coverageObj.payor[0].reference?.value || undefined;
    const planType = generalWorksheet.getCell('C13');
    planType.value = coverageObj.planType?.value || undefined;
    const policyType = generalWorksheet.getCell('D13');
    policyType.value = coverageObj.type.coding[0].display?.value || undefined;
    const dependents = generalWorksheet.getCell('E13');
    dependents.value = coverageObj.dependents?.value || coverageObj.beneficiary.reference.value.slice(0, 3);
    const relationship = generalWorksheet.getCell('F13');
    relationship.value = coverageObj.relationship.coding[0].code?.value || undefined;
    const planStart = generalWorksheet.getCell('G13');
    planStart.value = dateFormatter(coverageObj.period.start?.value) || '0/0/00';
    const planEnd = generalWorksheet.getCell('H13');
    planEnd.value = dateFormatter(coverageObj.period.end?.value) || '0/0/00';

    // MEASURE TAB: HEADERS
    const lastUpdated2 = measureWorksheet.getCell('C1');
    lastUpdated2.value = moment(new Date()).format('MM/DD/YYYY');
    const header2 = measureWorksheet.getCell('A3');
    header2.value = `${measure.toUpperCase()} - Compliance Results` || undefined;
    const subheader2 = measureWorksheet.getCell('A5');
    subheader2.value = memberObj.description || undefined;

    // MEASURE COMPLIANCE RESULTS
    // console.log(">>>>MEMBER INFO:", memberInfo)
    // LOOP THROUGH EACH MEASURE - NUMERATORS?
    // APPLY COLOR STYLE TO STYLE

    await workbook.xlsx.writeFile(`${__root}${folderPath}/${fileName}`);
  } catch (error) {
    console.log(error);
  }
}

async function injectTemplate(results, root, path, name, type) {
  await fs.promises.copyFile(`${root}/src/templates/${type}.xlsx`,
    `${root}${path}/${name}`);
  await generateMemberReport(results, name, path);
}

module.exports = {
  generateMemberReport,
  injectTemplate,
};
