const calcLatestNumDen = (resultList) => {

  const resultMap = new Map();

  for (const patient of resultList) {
    const measurementType = patient.measurementType;

    if (!resultMap.has(measurementType)) {
      resultMap.set(measurementType, {
        numeratorValues: [],
        denominatorValues: []
      })
    }

    const patientData = patient[patient.memberId]

    for (const patientField in patientData) {

      resultHolder = resultMap.get(measurementType);

      if (patientField.startsWith('Numerator')) {
        let numCount = 0;
        if (patientField !== 'Numerator') {
          numCount = patientField.replace('Numerator ', '') - 1
        }
        const numValue = patientData[patientField] === true ? 1 : 0
        console.log('Num Value = ' + numValue);
        if (resultHolder.numeratorValues[numCount] === undefined) {
          resultHolder.numeratorValues[numCount] = numValue
        }
        else {
          resultHolder.numeratorValues[numCount] += numValue
        }
      }
      else if (patientField.startsWith('Denominator')) {
        let denCount = 0;
        if (patientField !== 'Denominator') {
          denCount = patientField.replace('Denominator ', '') - 1
        }
        const denValue = patientData[patientField] === true ? 1 : 0
        console.log("Den Value = " + denValue);
        if (resultHolder.denominatorValues[denCount] === undefined) {
          resultHolder.denominatorValues[denCount] = denValue
        }
        else {
          resultHolder.denominatorValues[denCount] += denValue
        }
      }
    }
  }

  /*const measureTypeCount = resultHolder.size;
  for(let j = 0; j < measureTypeCount; j++) {
    const measureSize = numeratorValues.length();
    const currentDate = new Date();
    const dateString = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate()
    for (let i = 0; i < measureSize; i++) {
      const numerator = numeratorValues[i];
      const denominator = denominatorValues[i];
      valueArray.push({
        measure: 'drre ' + (i + 1),
        date: dateString,
        value: (numerator/denominator) * 100
      });
    }
  }*/

  //return valueArray;
}

module.exports = {
  calcLatestNumDen
};