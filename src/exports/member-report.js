/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
const fs = require('fs');
const process = require('process');
const moment = require('moment');
const excel = require('exceljs');

async function generateMemberReport(memberObj, fileName, folderPath) {
  const __root = process.cwd();
  const workbook = new excel.Workbook();
  const measure = memberObj.measurementType

  try {
    // GET WORKBOOK
    await workbook.xlsx.readFile(`${__root}${folderPath}/${fileName}`)

    console.log(memberObj)

    // DEFINING WORKSHEETS
    const generalWorksheet = workbook.getWorksheet('General')
    const measureWorksheet = workbook.getWorksheet(measure)

    // MEMBER DATA TO INSERT
    const placeholderMemberId = '#00000000'
    const coverageObj = memberObj.coverage[0];
    const planDates = `${coverageObj.period.start.value} to ${coverageObj.period.end.value}`;
    const memberInfo = memberObj[memberObj.memberId];

    const dateFormatter = (date) => {
      const res = date.split("-")
      return [res[1], res[2], res[0]].join("/")
    }

    // SETTING BASIC WORKBOOK INFO
    workbook.creator = 'Saraswati Automatic Export';
    workbook.lastModifiedBy = 'Saraswati Automatic Export';
    workbook.created = new Date();
    workbook.modified = new Date();

    // GENERAL TAB: MEMBER INFO
    const lastUpdated = generalWorksheet.getCell('C1');
    lastUpdated.value = moment(new Date()).format("MM/DD/YYYY")
    const header = generalWorksheet.getCell('A3')
    header.value = `Member ${placeholderMemberId} Analysis Report ${planDates}`
    const subheader = generalWorksheet.getCell('A5')
    subheader.value = `This report is a summary of member ${placeholderMemberId}'s measure records and analysis of data from ${planDates} as pulled from the Saraswati platform.`

    const memberId = generalWorksheet.getCell('A9')
    memberId.value = placeholderMemberId
    const dob = generalWorksheet.getCell('B9')
    dob.value = "undefined"
    const age = generalWorksheet.getCell('C9')
    age.value = "undefined"
    const gender = generalWorksheet.getCell('D9')
    gender.value = "undefined"
    const coverageStatus = generalWorksheet.getCell('E9')
    coverageStatus.value = coverageObj.status.value

    // ACTIVE AND INACTIVE STYLING
    if (coverageStatus.value === "active") {
      coverageStatus.font = { color: "1AC93D", bold: true }
    } else {
      coverageStatus.font = { color: "C91A1A", bold: true }
    }

    const applicableMeasures = generalWorksheet.getCell('F9')
    applicableMeasures.value = 1 // TODO this needs to be dynamic
    const participationStart = generalWorksheet.getCell('G9')
    participationStart.value = dateFormatter(coverageObj.period.start.value)
    const participationEnd = generalWorksheet.getCell('H9')
    participationEnd.value = dateFormatter(coverageObj.period.end.value)

    // GENERAL TAB: POLICY INFO: THE DATA
    const policyId = generalWorksheet.getCell('A13')
    policyId.value = coverageObj.id.value
    const payorProvider = generalWorksheet.getCell('B13')
    payorProvider.value = coverageObj.payor[0].reference.value
    const planType = generalWorksheet.getCell('C13')
    planType.value = "undefined"
    const policyType = generalWorksheet.getCell('D13')
    policyType.value = coverageObj.type.coding[0].display.value
    const dependents = generalWorksheet.getCell('E13')
    dependents.value = coverageObj.beneficiary.reference.value.slice(0,3) //placeholder
    console.log(coverageObj.beneficiary.reference)
    const relationship = generalWorksheet.getCell('F13')
    relationship.value = coverageObj.relationship.coding[0].code.value
    const planStart = generalWorksheet.getCell('G13')
    planStart.value = dateFormatter(coverageObj.period.start.value)
    const planEnd = generalWorksheet.getCell('H13')
    planEnd.value = dateFormatter(coverageObj.period.end.value)

    // MEASURE TAB: HEADERS
    const lastUpdated2 = measureWorksheet.getCell('C1');
    lastUpdated2.value = moment(new Date()).format("MM/DD/YYYY")
    const header2 = measureWorksheet.getCell('A3')
    header2.value = `${measure.toUpperCase()} - Compliance Results`
    const subheader2 = measureWorksheet.getCell('A5')
    subheader2.value = "IMA-E Assesses adolescents 13 years of age who had one dose of meningococcal vaccine, one Tdap vaccine and the complete human papillomavirus vaccine series by their 13th birthday."

    // MEASURE COMPLIANCE RESULTS
    // LOOP THROUGH EACH MEASURE
    // APPLY COLOR STYLE TO STYLE

    await workbook.xlsx.writeFile(`${__root}${folderPath}/${fileName}`)

  } catch (error) {
    console.log(error)
  }

  // {
  //   _id: 'imae-5e99fea7-f83c-4b87-ad21-08d196a8dc45-imae-0',
  //   measurementType: 'imae',
  //   memberId: 'imae-5e99fea7-f83c-4b87-ad21-08d196a8dc45',
  //   timeStamp: '2022-06-06T14:51:01.488Z',
  //   coverage: [
  //     {
  //        status: { value: 'active' },
          // type: { coding: [Array] },
          // subscriber: { reference: [Object] },
          // beneficiary: { reference: [Object] },
          // relationship: { coding: [Array] },
          // period: { start: [Object], end: [Object] },
          // payor: [ [Object] ],
          // id: { value: '1f39dc1f-6611-4fee-8f95-7ace85c5cdcd' }
  //     }
  //   ],
  //   providers: [
  //     {
  //       reference: 'Organization?identifier=71533123',
  //       display: 'Norton Hill Carecenter'
  //     },
  //     {
  //       reference: 'Practitioner?identifier=1143',
  //       display: 'Doctor Anne Guish'
  //     },
  //     {
  //       reference: 'Practitioner?identifier=1221',
  //       display: 'Nurse Karen Patches'
  //     }
  //   ],
  //   'imae-5e99fea7-f83c-4b87-ad21-08d196a8dc45': {
  //     'Initial Population 1': true,
  //     'Initial Population 2': true,
  //     'Initial Population 3': true,
  //     'Initial Population 4': true,
  //     'Initial Population 5': true,
  //     'Exclusions 1': false,
  //     'Exclusions 2': false,
  //     'Exclusions 3': false,
  //     'Exclusions 4': false,
  //     'Exclusions 5': false,
  //     'Denominator 1': true,
  //     'Denominator 2': true,
  //     'Denominator 3': true,
  //     'Denominator 4': true,
  //     'Denominator 5': true,
  //     'Numerator 1': true,
  //     'Numerator 2': true,
  //     'Numerator 3': true,
  //     'Numerator 4': true,
  //     'Numerator 5': true,
  //     id: 'imae-5e99fea7-f83c-4b87-ad21-08d196a8dc45'
  //   }
  // }

}

module.exports = {
  generateMemberReport,
};
