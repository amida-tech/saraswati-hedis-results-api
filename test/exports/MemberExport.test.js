/* eslint-disable no-undef */
const process = require('process');
const excel = require('exceljs');
const { fs } = require('fs');
const { injectTemplate } = require('../../src/exports/member-report');
const { mockMemberExportDataObj } = require('../export-test-data/userData');

const __root = process.cwd();
const staticWorkbook = new excel.Workbook();
const generatedWorkbook = new excel.Workbook();
const folderPath = '/test/export-test-data';
const saticFileName = 'staticTestFile.xlsx';
const testFileName = 'test.xlsx';

describe('Member-Report generation tests', () => {
  beforeAll(async () => {
    // Loads static and generates dynamic before loading it back for comparison
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
    // Selector Consts
    const staticWorksheet = staticWorkbook.getWorksheet('General');
    const generatedWorksheet = generatedWorkbook.getWorksheet('General');
    const staticMemberId = staticWorksheet.getCell('A9');
    const generatedMemberId = generatedWorksheet.getCell('A9');
    const staticDob = staticWorksheet.getCell('B9');
    const generatedDob = generatedWorksheet.getCell('B9');
    const staticAge = staticWorksheet.getCell('C9');
    const generatedAge = generatedWorksheet.getCell('C9');
    const staticGender = staticWorksheet.getCell('D9');
    const generatedGender = generatedWorksheet.getCell('D9');
    const staticCoverageStatus = staticWorksheet.getCell('E9');
    const generatedCoverageStatus = generatedWorksheet.getCell('E9');
    // Actual tests
    expect(staticMemberId.value).toEqual(generatedMemberId.value);
    expect(staticDob.value).toEqual(generatedDob.value);
    expect(staticAge.value).toEqual(generatedAge.value);
    expect(staticGender.value).toEqual(generatedGender.value);
    expect(staticCoverageStatus.value).toEqual(generatedCoverageStatus.value);
  });

  test('Polcy Info Identicality', () => {
    // Selector Consts
    const staticWorksheet = staticWorkbook.getWorksheet('General');
    const generatedWorksheet = generatedWorkbook.getWorksheet('General');
    const staticPolicyId = staticWorksheet.getCell('A13');
    const generatedPolicyId = generatedWorksheet.getCell('A13');
    const staticPayor = staticWorksheet.getCell('B13');
    const generatedPayor = generatedWorksheet.getCell('B13');
    const staticPlanType = staticWorksheet.getCell('C13');
    const generatedPlanType = generatedWorksheet.getCell('C13');
    const staticPolicyType = staticWorksheet.getCell('D13');
    const generatedPolicyType = generatedWorksheet.getCell('D13');
    const staticDependants = staticWorksheet.getCell('E13');
    const generatedDependants = generatedWorksheet.getCell('E13');
    const staticRelationship = staticWorksheet.getCell('F13');
    const generatedRelationship = generatedWorksheet.getCell('F13');
    const staticPlanStart = staticWorksheet.getCell('G13');
    const generatedPlanStart = generatedWorksheet.getCell('G13');
    const staticPlanEnd = staticWorksheet.getCell('H13');
    const generatedPlanEnd = generatedWorksheet.getCell('H13');
    // Actual tests
    expect(staticPolicyId.value).toEqual(generatedPolicyId.value);
    expect(staticPayor.value).toEqual(generatedPayor.value);
    expect(staticPlanType.value).toEqual(generatedPlanType.value);
    expect(staticPolicyType.value).toEqual(generatedPolicyType.value);
    expect(staticDependants.value).toEqual(generatedDependants.value);
    expect(staticRelationship.value).toEqual(generatedRelationship.value);
    expect(staticPlanStart.value).toEqual(generatedPlanStart.value);
    expect(staticPlanEnd.value).toEqual(generatedPlanEnd.value);
  });

  afterAll(async () => {
    fs.unlink(`${__root}${folderPath}/${testFileName}`);
  });
});
