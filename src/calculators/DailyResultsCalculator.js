const { calcLatestNumDen } = require('./NumDenCalculator');

const dayMiliseconds = 86400000;
const eodMiliseconds = 84960000;

const calculateDailyMeasureResults = (patientResults, measureInfo, calculateComposite = true) => {
  const currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);
  // eslint-disable-next-line max-len
  let dailyMeasureResults = calcLatestNumDen(patientResults, measureInfo, currentDate, calculateComposite);

  // Set the day to 5/5/2022, but compare the times against 5/5/2022 11:59:59 PM
  let newDate = new Date(currentDate.getTime() - dayMiliseconds);
  let filteredResults = patientResults.filter(
    (element) => new Date(element.timeStamp).getTime() < (newDate.getTime() + eodMiliseconds),
  );
  while (filteredResults.length !== 0) {
    dailyMeasureResults = dailyMeasureResults
      .concat(calcLatestNumDen(filteredResults, measureInfo, newDate, calculateComposite));
    newDate = new Date(newDate.getTime() - dayMiliseconds);
    const compareDateTime = newDate.getTime() + eodMiliseconds;
    filteredResults = filteredResults.filter(
      (element) => new Date(element.timeStamp).getTime() < compareDateTime,
    );
  }

  return dailyMeasureResults.sort((a, b) => a.date - b.date);
};

module.exports = {
  calculateDailyMeasureResults,
};
