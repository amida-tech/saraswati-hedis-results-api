/* eslint-disable import/prefer-default-export */
const ExcelJS = require('exceljs');

async function generateTestReport() {
  const workbook = new ExcelJS.Workbook();
  const fileName = 'thisIsaTest';

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
  const row1 = worksheet1.getRow(1);
  row1.values = ['Today', 'Revolver Ocelot'];
  worksheet1.addRow({ id: 2, name: 'Solid Snake', date: 'Tomorrow' });

  await workbook.xlsx.writeFile(fileName);
}

module.exports = {
  generateTestReport,
};
