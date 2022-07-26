/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
const moment = require('moment');
const ExcelJS = require('exceljs');

async function generateMemberReport(memberObj, fileName) {
  console.log(memberObj)
  console.log(fileName)
}

module.exports = {
  generateMemberReport,
};
