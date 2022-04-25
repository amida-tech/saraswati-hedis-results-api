const { calculateCompositeStarRating, calculateMeasureStarRating } = require('./StarRatingCalculator');

function setValue(valueArray, valueName, fieldName, patient) {
  const array = valueArray;
  let numCount = 0;
  // Get which number this is (Numerator 3, Denominator 1, etc...)
  if (fieldName !== valueName) {
    numCount = fieldName.replace(`${valueName} `, '') - 1;
  }

  // Get field value, either convert boolean to int or get size of array
  const valueField = patient[fieldName];
  let value = 0;
  if (Array.isArray(valueField)) {
    value = valueField.length;
  } else {
    value = valueField === true ? 1 : 0;
  }

  // Add value to existing value or create initial value
  if (array[numCount] === undefined) {
    array[numCount] = value;
  } else {
    array[numCount] += value;
  }
}

function calculateMeasureScore(subScoreArray, measurementType, date) {
  let numerator = 0;
  let denominator = 0;
  let initialPopulation = 0;
  let exclusions = 0;
  for (let i = 0; i < subScoreArray.length; i += 1) {
    numerator += subScoreArray[i].numerator;
    denominator += subScoreArray[i].denominator;
    initialPopulation += subScoreArray[i].initialPopulation;
    exclusions += subScoreArray[i].exclusions;
  }
  const value = (denominator === 0 ? 0 : numerator / denominator) * 100;
  const { starRating } = calculateMeasureStarRating({
    measure: measurementType,
    numerator,
    denominator,
  });
  return {
    measure: measurementType,
    date,
    value,
    starRating,
    denominator,
    numerator,
    initialPopulation,
    exclusions,
    subScores: subScoreArray,
  };
}

function calculateSubScore(resultHolder, measurementType, date, index) {
  const numerator = resultHolder.numeratorValues[index];
  const denominator = resultHolder.denominatorValues[index];
  const percentValue = denominator === 0 ? 0 : numerator / denominator;
  return {
    measure: `${measurementType}-${index + 1}`,
    date,
    value: percentValue * 100,
    denominator,
    numerator,
    initialPopulation: resultHolder.initialPopulationValues[index],
    exclusions: resultHolder.exclusionValues[index],
  };
}

const calcLatestNumDen = (resultList) => {
  const resultMap = new Map();
  const measurementTypes = [];

  resultList.forEach((patient) => {
    const { measurementType } = patient;
    if (!measurementTypes.includes(measurementType)) {
      measurementTypes.push(measurementType);
    }

    if (!resultMap.has(measurementType)) {
      resultMap.set(measurementType, {
        numeratorValues: [],
        denominatorValues: [],
        initialPopulationValues: [],
        exclusionValues: [],
      });
    }

    const patientData = patient[patient.memberId];
    const resultHolder = resultMap.get(measurementType);

    // Save values for each field name, putting subscores into their respective index
    Object.keys(patientData).forEach((patientField) => {
      if (patientField.startsWith('Numerator')) {
        setValue(resultHolder.numeratorValues, 'Numerator', patientField, patientData);
      } else if (patientField.startsWith('Denominator')) {
        setValue(resultHolder.denominatorValues, 'Denominator', patientField, patientData);
      } else if (patientField.startsWith('Initial Population')) {
        setValue(resultHolder.initialPopulationValues, 'Initial Population', patientField, patientData);
      } else if (patientField.startsWith('Exclusions')) {
        setValue(resultHolder.exclusionValues, 'Exclusions', patientField, patientData);
      }
    });
  });

  // To store final results
  const valueArray = [];
  const currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  for (let k = 0; k < measurementTypes.length; k += 1) {
    const subScoreArray = [];
    // Get result holder for the measurement type
    const measurementType = measurementTypes[k];
    const resultHolder = resultMap.get(measurementType);

    const measureSize = resultHolder.numeratorValues.length;

    for (let i = 0; i < measureSize; i += 1) {
      // calculate scores for each subscore
      subScoreArray.push(calculateSubScore(resultHolder, measurementType, currentDate, i));
    }
    // use subscores to calculate aggregate measure score (also storing subscore)
    valueArray.push(calculateMeasureScore(subScoreArray, measurementType, currentDate));
  }

  // calculate the total overall score and star rating
  let compositeStarRating = 0;
  let compositeValue = 0;
  let starValueCount = 0;
  let numerator = 0;
  let denominator = 0;
  let initialPopulation = 0;
  let exclusions = 0;
  valueArray.forEach((result) => {
    compositeValue += result.value;
    if (result.starRating >= 0) {
      starValueCount += 1;
      compositeStarRating += result.starRating;
    }
    numerator += result.numerator;
    denominator += result.denominator;
    initialPopulation += result.initialPopulation;
    exclusions += result.exclusions;
  });
  compositeStarRating = starValueCount === 0 ? 0 : compositeStarRating / starValueCount;
  compositeValue /= valueArray.length;

  valueArray.push({
    measure: 'composite',
    date: currentDate,
    value: compositeValue,
    starRating: calculateCompositeStarRating(compositeStarRating),
    numerator,
    denominator,
    initialPopulation,
    exclusions,
  });

  return valueArray;
};

module.exports = {
  calcLatestNumDen,
  setValue,
};
