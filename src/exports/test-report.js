/* eslint-disable import/prefer-default-export */
const ExcelJS = require('exceljs');

async function generateTestReport() {
  const workbook = new ExcelJS.Workbook();
  const fileName = 'thisIsaTest.xlsx';

  workbook.creator = 'Saraswati Automatic Export';
  workbook.lastModifiedBy = 'Saraswati Automatic Export';
  workbook.created = new Date();
  workbook.modified = new Date();

  workbook.addWorksheet('This is a Test');

  const worksheet1 = workbook.getWorksheet('This is a Test');
  worksheet1.columns = [
    { header: 'Id', key: 'id' },
    { header: 'Date', key: 'date' },
    { header: 'Name', key: 'name' },
  ];
  worksheet1.addRow({ id: 3, name: 'Solid Snake', date: 'Today' });
  worksheet1.addRow({ id: 2, name: 'Revolver Ocelot', date: 'Yesterday' });
  worksheet1.addRow({ id: 4, name: 'Jack Raiden', date: 'Tomorrow' });

  await workbook.xlsx.writeFile(`./test/export-test-data/${fileName}`);

  return true;
}

module.exports = {
  generateTestReport,
};
