const calculateMeasureStarRating = (rating) => {
  const measurementStarRating = {
    measure: rating.measure,
  };
  if (rating.denominator === undefined || rating.denominator < 30) {
    measurementStarRating.starRating = -1;
    return measurementStarRating;
  }
  const starBase = (rating.inverted
    ? (1 - (rating.numerator / rating.denominator))
    : (rating.numerator / rating.denominator)) * 5;
  const starDecimal = starBase % 1;
  const star = Math.trunc(starBase);
  if (starDecimal >= 0.75) {
    measurementStarRating.starRating = star + 1;
  } else if (starDecimal >= 0.25 && starDecimal < 0.75) {
    measurementStarRating.starRating = star + 0.5;
  } else {
    measurementStarRating.starRating = star;
  }
  return measurementStarRating;
};

const calculateCompositeStarRating = (value) => {
  const starDecimal = value % 1;
  const star = Math.trunc(value);
  if (starDecimal >= 0.75) {
    return star + 1;
  } if (starDecimal >= 0.25 && starDecimal < 0.75) {
    return star + 0.5;
  }
  return star;
};

module.exports = {
  calculateMeasureStarRating,
  calculateCompositeStarRating,
};
