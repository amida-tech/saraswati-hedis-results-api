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
const saticFileName = 'aab-3198178a-5bc8-4c26-b7d0-65360b44f2dc.xlsx';
const testFileName = 'test.xlsx';

describe('Member-Report generation tests', () => {
  beforeAll(async () => {
    await staticWorkbook.xlsx.readFile(`${__root}${folderPath}/${saticFileName}`);
    await injectTemplate(mockMemberExportDataObj, __root, folderPath, testFileName);
    await generatedWorkbook.xlsx.readFile(`${__root}${folderPath}/${testFileName}`);
  });

  test('Creator Identicality', () => {
    expect(generatedWorkbook.creator).toEqual(staticWorkbook.creator);
  });
});
