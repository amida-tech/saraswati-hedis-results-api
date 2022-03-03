const fs = require('fs');
const path = require('path');
const { calcLatestNumDen } = require('../../src/calculators/NumDenCalculator');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/search-data.json`));

describe(' NumDenCalculator test ', () => {
  let resultArray;

  beforeAll(() => {
    resultArray = calcLatestNumDen(data);
  });

  test('Should not be null', () => {
    expect(resultArray).toBeTruthy();
  });

  test('Check measurement type sorting', () => {
    expect(resultArray.length).toEqual(3);
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
