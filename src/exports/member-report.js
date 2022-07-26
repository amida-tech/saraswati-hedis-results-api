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
    console.log(workbook)

    // DEFINING WORKSHEETS
    const generalWorksheet = workbook.getWorksheet('General')
    const measureWorksheet = workbook.getWorksheet(measure)

    // MEMBER DATA TO INSERT
    const placeHolderString = 'N/A in current version';
    const placeholderMemberId = '#00000000'
    const coverageObj = memberObj.coverage[0];
    const planDates = `${coverageObj.period.start.value} to ${coverageObj.period.end.value}`;
    const memberInfo = memberObj[memberObj.memberId];

    //console.log("coverage:", coverageObj)
    // {
    //   status: { value: 'active' },
    //   type: { coding: [ [Object] ] },
    //   subscriber: {
    //     reference: { value: 'Patient/imae-5e99fea7-f83c-4b87-ad21-08d196a8dc45' }
    //   },
    //   beneficiary: {
    //     reference: { value: 'Patient/imae-5e99fea7-f83c-4b87-ad21-08d196a8dc45' }
    //   },
    //   relationship: { coding: [ [Object] ] },
    //   period: { start: { value: '2021-06-06' }, end: { value: '2023-06-06' } },
    //   payor: [ { reference: [Object] } ],
    //   id: { value: '1f39dc1f-6611-4fee-8f95-7ace85c5cdcd' }
    // }
    //console.log("plan dates:", planDates)
    // 2021-06-06 
    // to 
    // 2023-06-06
    //console.log("member info:", memberInfo)
    // {
    //   'Initial Population 1': true,
    //   'Initial Population 2': true,
    //   'Initial Population 3': true,
    //   'Initial Population 4': true,
    //   'Initial Population 5': true,
    //   'Exclusions 1': false,
    //   'Exclusions 2': false,
    //   'Exclusions 3': false,
    //   'Exclusions 4': false,
    //   'Exclusions 5': false,
    //   'Denominator 1': true,
    //   'Denominator 2': true,
    //   'Denominator 3': true,
    //   'Denominator 4': true,
    //   'Denominator 5': true,
    //   'Numerator 1': true,
    //   'Numerator 2': true,
    //   'Numerator 3': true,
    //   'Numerator 4': true,
    //   'Numerator 5': true,
    //   id: 'imae-5e99fea7-f83c-4b87-ad21-08d196a8dc45'
    // }

    // SETTING BASIC INFO
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
    dob.value = placeHolderString
    const age = generalWorksheet.getCell('C9')
    age.value = placeHolderString
    const gender = generalWorksheet.getCell('D9')
    gender.value = placeHolderString
    const coverageStatus = generalWorksheet.getCell('E9')
    coverageStatus.value = coverageObj.status.value
    const applicableMeasures = generalWorksheet.getCell('F9')
    applicableMeasures.value = 1 // TODO this needs to be dynamic
    const participationStart = generalWorksheet.getCell('G9')
    participationStart.value = coverageObj.period.start.value
    const participationEnd = generalWorksheet.getCell('H9')
    participationEnd.value = coverageObj.period.end.value

    // // GENERAL TAB: POLICY INFO
    // const policyId = generalWorksheet.getCell('13A')
    // const payorProvider = generalWorksheet.getCell('13B')
    // const planType = generalWorksheet.getCell('13C')
    // const policyType = generalWorksheet.getCell('13D')
    // const dependents = generalWorksheet.getCell('13E')
    // const relationship = generalWorksheet.getCell('13F')
    // const planStart = generalWorksheet.getCell('13G')
    // const planEnd = generalWorksheet.getCell('13H')
    // TODO MAKE THE 13 DYNAMIC

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
  // console.log(fileName)
  // imae-5e99fea7-f83c-4b87-ad21-08d196a8dc45.xlsx
}

module.exports = {
  generateMemberReport,
};
