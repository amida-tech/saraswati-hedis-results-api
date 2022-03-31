/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const { calculateTrend } = require('../../src/calculators/TrendCalculator');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/result-data/measure-results.json`));

describe(' Trend Calculation test ', () => {
  let resultArray;

  beforeAll(() => {
    const correctData = [];
    for (let i = 0; i < data.length; i += 1) {
      const dateObject = new Date(data[i].date);
      const newObject = data[i];
      newObject.date = dateObject;
      correctData.push(newObject);
    }
    resultArray = calculateTrend(correctData, {}, 7);
  });

  test('Should not be null', () => {
    expect(resultArray).toBeTruthy();
  });

  test('Check measurement type sorting', () => {
    expect(resultArray.length).toEqual(5);
  });

  test('Check calculations', () => {
    expect(resultArray[0].percentChange).toEqual(-30);
    expect(resultArray[2].percentChange).toEqual(-18);
    expect(resultArray[4].percentChange).toEqual(23);
  });
});
