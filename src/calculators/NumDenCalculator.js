function setValue(array, valueName, fieldName, patient) {
  let numCount = 0;
  // Get which number this is (Numerator 3, Denominator 1, etc...)
  if (fieldName != valueName) {
    numCount = fieldName.replace(`${valueName} `, '') - 1;
  }

  // Get field value, either convert boolean to int or get size of array
  const valueField = patient[fieldName];
  const value = Array.isArray(valueField) ? valueField.length : valueField === true ? 1 : 0;

  // Add value to existing value or create initial value
  array[numCount] === undefined ? (array[numCount] = value) : (array[numCount] += value);
}

function calculateMeasureScore(subScoreArray, measurementType, dateString) {
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
  return {
    measure: measurementType,
    date: dateString,
    value: (denominator === 0 ? 0 : numerator / denominator) * 100,
    denominator,
    numerator,
    initialPopulation,
    exclusions,
    subScores: subScoreArray,
  };
}

const calcLatestNumDen = (resultList) => {
  const resultMap = new Map();
  const measurementTypes = [];

  for (const patient of resultList) {
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
    let resultHolder = resultMap.get(measurementType);

    // Save values for each field name, putting subscores into their respective index
    for (const patientField in patientData) {
      if (patientField.startsWith('Numerator')) {
        setValue(resultHolder.numeratorValues, 'Numerator', patientField, patientData);
      } else if (patientField.startsWith('Denominator')) {
        setValue(resultHolder.denominatorValues, 'Denominator', patientField, patientData);
      } else if (patientField.startsWith('Initial Population')) {
        setValue(resultHolder.initialPopulationValues, 'Initial Population', patientField, patientData);
      } else if (patientField.startsWith('Exclusions')) {
        setValue(resultHolder.exclusionValues, 'Exclusions', patientField, patientData);
      }
    }
  }

  // To store final results
  const valueArray = [];
  const currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);

  for (let k = 0; k < measurementTypes.length; k += 1) {
    const subScoreArray = [];
    // Get result holder for the measurement type
    const measurementType = measurementTypes[k];
    resultHolder = resultMap.get(measurementType);

    const measureSize = resultHolder.numeratorValues.length;

    for (let i = 0; i < measureSize; i += 1) {
      // calculate scores for each subscore
      subScoreArray.push(calculateSubScore(resultHolder, measurementType, currentDate, i));
    }
    // use subscores to calculate aggregate measure score (also storing subscore)
    valueArray.push(calculateMeasureScore(subScoreArray, measurementType, currentDate));
  }

  return valueArray;
};

function calculateSubScore(resultHolder, measurementType, dateString, index) {
  const numerator = resultHolder.numeratorValues[index];
  const denominator = resultHolder.denominatorValues[index];
  const percentValue = denominator === 0 ? 0 : numerator / denominator;
  return {
    measure: `${measurementType} ${index + 1}`,
    date: dateString,
    value: percentValue * 100,
    denominator,
    numerator,
    initialPopulation: resultHolder.initialPopulationValues[index],
    exclusions: resultHolder.exclusionValues[index],
  };
}

module.exports = {
  calcLatestNumDen,
};
