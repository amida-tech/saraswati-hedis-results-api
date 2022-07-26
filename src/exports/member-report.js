/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
const moment = require('moment');
const ExcelJS = require('exceljs');

async function generateMemberReport(memberObj, fileName) {
  console.log(memberObj)
  // {
  //   _id: 'imae-5e99fea7-f83c-4b87-ad21-08d196a8dc45-imae-0',
  //   measurementType: 'imae',
  //   memberId: 'imae-5e99fea7-f83c-4b87-ad21-08d196a8dc45',
  //   timeStamp: '2022-06-06T14:51:01.488Z',
  //   coverage: [
  //     {
  //       status: [Object],
  //       type: [Object],
  //       subscriber: [Object],
  //       beneficiary: [Object],
  //       relationship: [Object],
  //       period: [Object],
  //       payor: [Array],
  //       id: [Object]
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
  console.log(fileName)
  // imae-5e99fea7-f83c-4b87-ad21-08d196a8dc45.xlsx
}

module.exports = {
  generateMemberReport,
};
