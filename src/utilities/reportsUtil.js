const { setValue } = require('../calculators/NumDenCalculator');

const createHeader = (measureInfo, measure) => {
  let csv = 'Member ID,Measurement,Time Stamp';
  if (Object.keys(measureInfo).length <= 2) {
    const { displayLabel } = measureInfo[measure];
    csv += `,${displayLabel} Denominator,${displayLabel} Numerator`;
  } else {
    Object.keys(measureInfo).forEach((fieldKey) => {
      const { displayLabel } = measureInfo[fieldKey];
      csv += `,${displayLabel} Denominator,${displayLabel} Numerator`;
    });
  }
  return csv;
};

const addRecord = (result, numeratorArray, denominatorArray) => {
  let numeratorTotal = 0;
  numeratorArray.forEach((value) => {
    numeratorTotal += value;
  });
  let denominatorTotal = 0;
  denominatorArray.forEach((value) => {
    denominatorTotal += value;
  });
  let recordToAdd = `\n${result.memberId},${result.measurementType},${result.timeStamp},${denominatorTotal},${numeratorTotal}`;
  let addPatient = false;
  let index = 0;
  while (index < numeratorArray.length) {
    if (numeratorArray.length > 1) {
      recordToAdd += `,${denominatorArray[index]},${numeratorArray[index]}`;
    }
    if (numeratorArray[index] !== denominatorArray[index]) {
      addPatient = true;
    }
    index += 1;
  }
  if (addPatient) {
    return recordToAdd;
  }
  return '';
};

const generateCsv = (patientResults, measureInfo, measure) => {
  let csv = createHeader(measureInfo, measure);

  patientResults.forEach((result) => {
    const numeratorArray = [];
    const denominatorArray = [];
    const patientResult = result[result.memberId];
    Object.keys(patientResult).forEach((fieldName) => {
      if (fieldName.startsWith('Numerator')) {
        setValue(numeratorArray, 'Numerator', fieldName, patientResult);
      } else if (fieldName.startsWith('Denominator')) {
        setValue(denominatorArray, 'Denominator', fieldName, patientResult);
      }
    });

    csv += addRecord(result, numeratorArray, denominatorArray);
  });

  return csv;
};

module.exports = {
  generateCsv,
};
