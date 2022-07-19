/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
const moment = require('moment');
const ExcelJS = require('exceljs');

async function generateMemberReport(memberObj) {
  const workbook = new ExcelJS.Workbook();
  const fileName = `${memberObj.memberId}.xlsx`;

  workbook.creator = 'Saraswati Automatic Export';
  workbook.lastModifiedBy = 'Saraswati Automatic Export';
  workbook.created = new Date();
  workbook.modified = new Date();

  workbook.addWorksheet('General');
  workbook.addWorksheet(memberObj.measurementType.toUpperCase());
  workbook.addWorksheet('Data');

  const measureWorksheet = workbook.getWorksheet(memberObj.measurementType.toUpperCase());
  const dataWorksheet = workbook.getWorksheet('Data');
  const displayWorksheet = workbook.getWorksheet('General');

  dataWorksheet.columns = [
    { header: 'Id', key: 'id', width: 5 },
    { header: 'Key', key: 'Key', width: 32 },
    { header: 'Value', key: 'Value', width: 32 },
  ];

  const placeHolderString = 'N/A in current version';
  const coverageObj = memberObj.coverage[0];
  const planDates = `${coverageObj.period.start.value} to ${coverageObj.period.end.value}`;
  const memberInfo = memberObj[memberObj.memberId];
  const compliant = memberInfo.Numerator.length > memberInfo.Exclusions.length;

  //  Data Sheet
  //    Member Info
  dataWorksheet.addRow({ id: 2, Key: 'Member ID', Value: memberObj.memberId });
  dataWorksheet.addRow({ id: 3, Key: 'Date of Birth', Value: placeHolderString });
  dataWorksheet.addRow({ id: 4, Key: 'Age', Value: placeHolderString });
  dataWorksheet.addRow({ id: 5, Key: 'Gender', Value: placeHolderString });
  dataWorksheet.addRow({ id: 6, Key: 'Coverage Status', Value: coverageObj.status.value });
  dataWorksheet.addRow({ id: 7, Key: 'Participation Period', Value: planDates });
  //   TODO: Will need to be changed once we have multi-measure users in data.
  dataWorksheet.addRow({ id: 8, Key: 'Applicable Measures', Value: '1' });

  //   Policy Info
  dataWorksheet.addRow({ id: 9, Key: 'Policy ID', Value: coverageObj.id.value });
  dataWorksheet.addRow({ id: 10, Key: 'Payor', Value: coverageObj.payor[0].reference.value });
  dataWorksheet.addRow({ id: 11, Key: 'Plan', Value: placeHolderString });
  dataWorksheet.addRow({ id: 12, Key: 'Type', Value: coverageObj.type.coding[0].display.value });
  dataWorksheet.addRow({ id: 13, Key: 'Subscriber', Value: coverageObj.subscriber.reference.value });
  dataWorksheet.addRow({ id: 14, Key: 'Beneficiary', Value: coverageObj.beneficiary.reference.value });
  dataWorksheet.addRow({ id: 15, Key: 'Relationship', Value: coverageObj.relationship.coding[0].code.value });
  dataWorksheet.addRow({ id: 16, Key: 'Plan Period', Value: planDates });

  //  Display Sheet
  const now = moment().format('MMM Do YYYY, h:mm:ss a');
  const dataKeys = dataWorksheet.getColumn(2).values;
  const dataValues = dataWorksheet.getColumn(3).values;

  displayWorksheet.addRow(['SARASAWTI', `Updated: ${now}`]);
  displayWorksheet.getColumn(1).font = {
    bold: true,
  };
  displayWorksheet.addRow();
  displayWorksheet.addRow([`Member ${memberObj.memberId} Measure Analysis Report ${planDates}`]);
  displayWorksheet.lastRow.font = {
    size: 20,
  };
  displayWorksheet.lastRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D7E1E2' },
  };
  displayWorksheet.addRow();
  displayWorksheet.addRow([`This report is a summary of member ${memberObj.memberId}'s measure records and analysis of data from ${planDates} as pulled froom the Saraswati platform. `]);
  displayWorksheet.addRow();
  displayWorksheet.addRow(['Member Info']);
  displayWorksheet.lastRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '546E7A' },
  };
  displayWorksheet.lastRow.font = {
    color: { argb: 'FFFFFF' },
    bold: true,
  };
  displayWorksheet.addRow(['', dataKeys[1], dataValues[1]]);
  displayWorksheet.addRow(['', dataKeys[2], dataValues[2]]);
  displayWorksheet.addRow(['', dataKeys[3], dataValues[3]]);
  displayWorksheet.addRow(['', dataKeys[4], dataValues[4]]);
  displayWorksheet.addRow(['', dataKeys[5], dataValues[5]]);
  displayWorksheet.addRow(['', dataKeys[6], dataValues[6].toUpperCase()]);
  if (dataValues[6] === 'active') {
    displayWorksheet.getCell('C13').font = {
      color: { argb: '11fc00' },
    };
  } else if (dataValues[6] === 'inactive') {
    displayWorksheet.getCell('C13').font = {
      color: { argb: '#fc0000' },
    };
  }
  displayWorksheet.addRow(['', dataKeys[7], dataValues[7]]);
  displayWorksheet.addRow();
  displayWorksheet.addRow(['Policy Info']);
  displayWorksheet.lastRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '546E7A' },
  };
  displayWorksheet.lastRow.font = {
    color: { argb: 'FFFFFF' },
    bold: true,
  };
  displayWorksheet.addRow(['', dataKeys[8], dataValues[8]]);
  displayWorksheet.addRow(['', dataKeys[9], dataValues[9]]);
  displayWorksheet.addRow(['', dataKeys[10], dataValues[10]]);
  displayWorksheet.addRow(['', dataKeys[11], dataValues[11]]);
  displayWorksheet.addRow(['', dataKeys[12], dataValues[12]]);
  displayWorksheet.addRow(['', dataKeys[13], dataValues[13]]);
  displayWorksheet.addRow(['', dataKeys[14], dataValues[14]]);
  displayWorksheet.addRow();
  displayWorksheet.getColumn(1).width = 19;
  displayWorksheet.getColumn(2).width = 19;
  displayWorksheet.getColumn(2).font = {
    bold: true,
  };
  displayWorksheet.getColumn(3).width = 19;

  // Table Worksheet
  measureWorksheet.addRow(['AAB - Avoidance of Antibiotic Treatment for Acute Bronchitis/Bronchiolitis']);
  measureWorksheet.lastRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D7E1E2' },
  };
  measureWorksheet.addRow();
  measureWorksheet.addRow(['Assesses the percentage of episodes for members 3 months of age and older with a diagnosis of'
    + 'acute bronchitis/bronchiolitis that did not result in an antibiotic dispensing event. A higher rate indicates appropriate'
    + ' treatment for bronchitis/bronchiolitis (i.e., the percentage of episodes that were not prescribed an antibiotic).']);
  measureWorksheet.addRow();
  measureWorksheet.addRow(['Measure', 'Type', 'Status', 'Exclusions', 'Practitioner', 'Dates', 'Criteria', 'Recommendations']);
  measureWorksheet.lastRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '546E7A' },
  };
  displayWorksheet.lastRow.font = {
    color: { argb: 'FFFFFF' },
    bold: true,
  };
  const compliance = compliant ? 'Compliant ' : 'Non-Compliant';
  const exclusions = memberInfo.Exclusions.length > 0 ? '\u2713' : '\u2716';
  measureWorksheet.addRow([memberObj.measurementType.toUpperCase(), 'Measure', compliance, exclusions, 'Practitioners', 'Dates', 'Criteria', 'Explosivo']);
  measureWorksheet.lastRow.height = 64;
  measureWorksheet.lastRow.alignment = { vertical: 'middle', horizontal: 'center' };
  measureWorksheet.getColumn(1).width = 19;
  measureWorksheet.getColumn(2).width = 19;
  measureWorksheet.getColumn(3).width = 19;

  await workbook.xlsx.writeFile(`./test/export-test-data/${fileName}`);

  return true;
}

module.exports = {
  generateMemberReport,
};
