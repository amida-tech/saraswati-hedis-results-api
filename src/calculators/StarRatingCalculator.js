const calculateStarRating = (rating) => {
    const measurementStarRating = {
        'measure': rating.measure,
    };
    if (rating.denominator === undefined || rating.denominator < 30) {
        measurementStarRating['starRating'] = -1;
        return measurementStarRating;
    }
    const starBase = rating.numerator / rating.denominator * 5;
    const starDecimal = starBase % 1;
    let star = Math.trunc(starBase);
    if (starDecimal >= 0.75) {
        measurementStarRating['starRating'] = star + 1;
    } else if (starDecimal >= 0.25 && starDecimal < 0.75) {
        measurementStarRating['starRating'] = star + 0.5;
    } else {
        measurementStarRating['starRating'] = star;
    }
    return measurementStarRating;
}

module.exports = {
    calculateStarRating,
}