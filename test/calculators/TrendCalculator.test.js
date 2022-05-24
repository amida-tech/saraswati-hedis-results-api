/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const { calculateTrend, calculateTrendLegacy } = require('../../src/calculators/TrendCalculator');
const { createInfoObject } = require('../../src/utilities/infoUtil');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/result-data/measure-results.json`));

const mockAabPatientResults = JSON.parse(fs.readFileSync(`${path.resolve()}/test/seed-data/aab.json`));
const mockDrrePatientResults = JSON.parse(fs.readFileSync(`${path.resolve()}/test/seed-data/drre.json`));
const mockImaePatientResults = JSON.parse(fs.readFileSync(`${path.resolve()}/test/seed-data/imae.json`));
const infoList = JSON.parse(fs.readFileSync(`${path.resolve()}/test/result-data/hedis-info.json`));

describe('Legacy Trend Calculation test ', () => {
  let resultArray;

  beforeAll(() => {
    const correctData = [];
    for (let i = 0; i < data.length; i += 1) {
      const dateObject = new Date(data[i].date);
      const newObject = data[i];
      newObject.date = dateObject;
      correctData.push(newObject);
    }
    resultArray = calculateTrendLegacy(correctData, {}, 7);
  });

  test('Should not be null', () => {
    expect(resultArray).toBeTruthy();
  });

  test('Check measurement type sorting', () => {
    expect(resultArray.length).toEqual(5);
  });

  test('Check legacy calculations', () => {
    expect(resultArray[0].percentChange).toEqual(-21);
    expect(resultArray[2].percentChange).toEqual(-8);
    expect(resultArray[4].percentChange).toEqual(11);
  });
});

describe('Trend Calculation test ', () => {
  let resultArray;

  beforeAll(() => {
    const allData = mockAabPatientResults.concat(
      mockDrrePatientResults,
      mockImaePatientResults,
    );
    const measureInfo = createInfoObject(infoList);
    resultArray = calculateTrend(allData, measureInfo, [], 3);
  });

  test('Should not be null', () => {
    expect(resultArray).toBeTruthy();
  });

  test('Check measurement type sorting', () => {
    expect(resultArray.length).toEqual(4);
  });

  test('Check calculations', () => {
    expect(resultArray[0].percentChange).toEqual(0);
    expect(resultArray[1].percentChange).toEqual(0);
    expect(resultArray[2].percentChange).toEqual(0);
    expect(resultArray[3].percentChange).toEqual(0);
  });
});
