/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const process = require('process');
const excel = require('exceljs');
const { injectTemplate } = require('../../src/exports/member-report');
const { mockMemberExportDataObj } = require('../export-test-data/userData');

const __root = process.cwd();
const staticWorkbook = new excel.Workbook();
const generatedWorkbook = new excel.Workbook();
const folderPath = '/test/export-test-data';
const saticFileName = 'aise-abf90a45-2c91-46a7-bd63-89e64c55cd54.xlsx';
const testFileName = 'test.xlsx';

describe('Member-Report generation tests', () => {
  beforeAll(async () => {
    await staticWorkbook.xlsx.readFile(`${__root}${folderPath}/${saticFileName}`);
    await injectTemplate(mockMemberExportDataObj, __root, folderPath, testFileName);
    await generatedWorkbook.xlsx.readFile(`${__root}${folderPath}/${testFileName}`);
  });

  test('Creator', () => {
    expect(staticWorkbook.creator).toEqual(generatedWorkbook.creator);
  });

  test('LastModified Identicality', () => {
    expect(staticWorkbook.lastModifiedBy).toEqual(generatedWorkbook.lastModifiedBy);
  });

  test('Member Info Identicality', () => {
    const staticWorksheet = staticWorkbook.getWorksheet('General');
    const generatedWorksheet = generatedWorkbook.getWorksheet('General');
    const staticMemberId = staticWorksheet.getCell('A9');
    const generatedMemberId = generatedWorksheet.getCell('A9');
    const staticDob = staticWorksheet.getCell('B9');
    const generatedDob = generatedWorksheet.getCell('B9');
    expect(staticMemberId.value).toEqual(generatedMemberId.value);
    expect(staticDob.value).toEqual(generatedDob.value);
  });
});
