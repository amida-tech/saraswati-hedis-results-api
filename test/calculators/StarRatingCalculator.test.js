const { calculateStarRating } = require('../../src/calculators/StarRatingCalculator');

describe(' StarRatingCalculator test ', () => {
  const measurementRating = {
    measure: 'drre',
  };

  afterAll(() => {
    delete measureRating.denominator;
    delete measureRating.numerator;
  });

  test('Should return -1 for NA because the denominator is undefined', () => {
    const result = calculateStarRating(measurementRating);
    expect(result.measure).toEqual('drre');
    expect(result.starRating).toEqual(-1);
  });

  test('Should return -1 for NA because the denominator is less than 30', () => {
    measurementRating.measure = 'aise';
    measurementRating.denominator = 29;
    const result = calculateStarRating(measurementRating);
    expect(result.measure).toEqual('aise');
    expect(result.starRating).toEqual(-1);
  });

  test('Should return 5 stars after rounding up', () => {
    measurementRating.measure= 'bcse';
    measurementRating.denominator = 43;
    measurementRating.numerator = 42;
    const result = calculateStarRating(measurementRating);
    expect(result.measure).toEqual('bcse');
    expect(result.starRating).toEqual(5);
  });

  test('Should return 4.5 stars after rounding', () => {
    measurementRating.measure= 'aab';
    measurementRating.denominator = 43;
    measurementRating.numerator = 39;
    const result = calculateStarRating(measurementRating);
    expect(result.measure).toEqual('aab');
    expect(result.starRating).toEqual(4.5);
  });

  test('Should return 4 stars after rounding down', () => {
    measurementRating.measure= 'uri';
    measurementRating.denominator = 43;
    measurementRating.numerator = 36;
    const result = calculateStarRating(measurementRating);
    expect(result.measure).toEqual('uri');
    expect(result.starRating).toEqual(4);
  });

});
