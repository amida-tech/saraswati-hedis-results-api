/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import moment from 'moment';

const ExcelJS = require('exceljs');

async function generateMemberReport(memberObj) {
  const workbook = new ExcelJS.Workbook();
  const fileName = `${memberObj.memberId}.xlsx`;

  workbook.creator = 'Saraswati Automatic Export';
  workbook.lastModifiedBy = 'Saraswati Automatic Export';
  workbook.created = new Date();
  workbook.modified = new Date();

  workbook.addWorksheet('General');
  workbook.addWorksheet(memberObj.measurementType);
  workbook.addWorksheet('Data');

  const displayWorksheet = workbook.getWorksheet('General');
  const measureWorksheet = workbook.getWorksheet(memberObj.measurementType);
  const dataWorksheet = workbook.getWorksheet('Data');

  dataWorksheet.columns = [
    { header: 'Id', key: 'id', width: 5 },
    { header: 'Key', key: 'Key', width: 32 },
    { header: 'Value', key: 'Value', width: 32 },
  ];

  const placeHolderString = 'N/A in current version';
  const coverageObj = memberObj.cverage[0];
  const planDates = `${coverageObj.period.start} - ${coverageObj.period.end}`;

  //  Data Sheet
  //    Member Info
  dataWorksheet.addRow({ id: 2, key: 'Member ID', value: memberObj.memberId });
  dataWorksheet.addRow({ id: 3, key: 'Date of Birth', value: placeHolderString });
  dataWorksheet.addRow({ id: 4, key: 'Age', value: placeHolderString });
  dataWorksheet.addRow({ id: 5, key: 'Gender', value: placeHolderString });
  dataWorksheet.addRow({ id: 6, key: 'Coverage Status', value: coverageObj.status.value });
  dataWorksheet.addRow({ id: 7, key: 'Participation Period', value: planDates });
  //   TODO: Will need to be changed once we have multi-measure users in data.
  dataWorksheet.addRow({ id: 8, key: 'Applicable Measures', value: 1 });

  //   Policy Info
  dataWorksheet.addRow({ id: 9, key: 'Policy ID', value: coverageObj.id.value });
  dataWorksheet.addRow({ id: 10, key: 'Payor', value: coverageObj.payor[0].reference.value });
  dataWorksheet.addRow({ id: 11, key: 'Plan', value: placeHolderString });
  dataWorksheet.addRow({ id: 12, key: 'Type', value: coverageObj.type.coding[0].display.value });
  dataWorksheet.addRow({ id: 13, key: 'Subscriber', value: coverageObj.subscriber.reference.value });
  dataWorksheet.addRow({ id: 14, key: 'Beneficiary', value: coverageObj.beneficiary.reference.value });
  dataWorksheet.addRow({ id: 15, key: 'Relationship', value: coverageObj.relationship.reference.value });
  dataWorksheet.addRow({ id: 16, key: 'Plan Period', value: planDates });

  //  Display Sheet
  const now = moment().format('MMM Do YYYY, h:mm:ss a');
  displayWorksheet.addRow('Saraswati', now);
  displayWorksheet.addRow();
  displayWorksheet.addRow(`Member ${memberObj.memberId} Measure Analysis Report ${planDates}`, 'green-gray');
  displayWorksheet.addRow();
  displayWorksheet.addRow(`This report is a summary of member ${memberObj.memberId}'s measure records and analysis of data from ${planDates} as pulled froom the Saraswati platform. `);
  displayWorksheet.addRow();
  displayWorksheet.addRow('Member Info', 'dark-teal');
  displayWorksheet.addRow();

  // const workSheetName = memberObj.memberId;

  // workbook.addWorksheet(workSheetName);

  // const worksheet1 = workbook.getWorksheet(workSheetName);
  // worksheet1.columns = [
  //   { header: 'Id', key: 'id' },
  //   { header: 'Date', key: 'date' },
  //   { header: 'Name', key: 'name' },
  // ];
  // worksheet1.addRow({ id: 3, name: 'Solid Snake', date: 'Today' });
  // worksheet1.addRow({ id: 2, name: 'Revolver Ocelot', date: 'Yesterday' });
  // worksheet1.addRow({ id: 4, name: 'Jack Raiden', date: 'Tomorrow' });

  await workbook.xlsx.writeFile(`./test/export-test-data/${fileName}`);

  return true;
}

module.exports = {
  generateMemberReport,
};
