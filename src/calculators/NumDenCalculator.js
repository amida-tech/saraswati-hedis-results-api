const calcLatestNumDen = (resultList) => {

  const resultMap = new Map();
  const measurementTypes = [];

  for (const patient of resultList) {
    const measurementType = patient.measurementType;
    if (!measurementTypes.includes(measurementType)) {
      measurementTypes.push(measurementType);
    }
    
    if (!resultMap.has(measurementType)) {
      resultMap.set(measurementType, {
        numeratorValues: [],
        denominatorValues: []
      })
    }

    const patientData = patient[patient.memberId]
    resultHolder = resultMap.get(measurementType);

    for (const patientField in patientData) {
      if (patientField.startsWith('Numerator')) {
        setValue(resultHolder.numeratorValues, 'Numerator', patientField, patientData);
      }
      else if (patientField.startsWith('Denominator')) {
        setValue(resultHolder.denominatorValues, 'Denominator', patientField, patientData);
      }
    }
  }

  //To store final results
  const valueArray = [];

  for (let k = 0; k < measurementTypes.length; k++) {
    //Get result holder for the measurement type
    const measurementType = measurementTypes[k];
    resultHolder = resultMap.get(measurementType);

    const measureSize = resultHolder.numeratorValues.length;
    const currentDate = new Date();
    const dateString = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate()
    for (let i = 0; i < measureSize; i++) {
      const numerator = resultHolder.numeratorValues[i];
      const denominator = resultHolder.denominatorValues[i];
      valueArray.push({
        measure: measurementType + ' ' + (i + 1),
        date: dateString,
        value: (numerator/denominator) * 100
      });
    }
  }
  console.log(valueArray);

  return valueArray;
}

function setValue(array, valueName, fieldName, patient) {
  let numCount = 0;
  //Get which number this is (Numerator 3, Denominator 1, etc...)
  if (fieldName !== valueName) {
    numCount = fieldName.replace(valueName + ' ', '') - 1
  }
  
  //Get field value, either convert boolean to int or get size of array
  const valueField = patient[fieldName];
  let value = 0;
  if (valueField.isArray) {
    value = valueField.size;
  }
  else {
    value = valueField === true ? 1 : 0
  }
  
  //Add value to existing value or create initial value
  if (array[numCount] === undefined) {
    array[numCount] = value
  }
  else {
    array[numCount] += value
  }
}

module.exports = {
  calcLatestNumDen
};