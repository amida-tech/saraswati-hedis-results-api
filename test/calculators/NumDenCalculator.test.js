/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const { calcLatestNumDen } = require('../../src/calculators/NumDenCalculator');
const { createInfoObject } = require('../../src/utilities/infoUtil');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/search-data.json`));
const infoList = JSON.parse(fs.readFileSync(`${path.resolve()}/test/result-data/hedis-info.json`));

describe(' NumDenCalculator test ', () => {
  let resultArray;

  beforeAll(() => {
    const measureInfo = createInfoObject(infoList);
    resultArray = calcLatestNumDen(data, measureInfo, new Date());
  });

  test('Should not be null', () => {
    expect(resultArray).toBeTruthy();
  });

  test('Check measurement type sorting', () => {
    expect(resultArray.length).toEqual(4);
  });

  test('Check calculations', () => {
    expect(resultArray[0].denominator).toEqual(14);
    expect(resultArray[1].numerator).toEqual(4);
    expect(resultArray[2].initialPopulation).toEqual(2);
  });

  test('Check subscore counts', () => {
    expect(resultArray[0].subScores.length).toEqual(3);
    expect(resultArray[1].subScores.length).toEqual(2);
    expect(resultArray[2].subScores.length).toEqual(2);
  });
});
