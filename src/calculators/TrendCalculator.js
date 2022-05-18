const { calcLatestNumDen } = require('./NumDenCalculator');

const calculateTrendLegacy = (resultData, predictionData, days) => {
  const resultList = resultData.sort((a, b) => b.date - a.date);
  const latestDate = resultList[0].date;
  const baseDate = new Date(latestDate.getTime() - (days * 24 * 60 * 60 * 1000));

  const resultMap = new Map();
  const measureList = [];
  let measureCount = 0;

  for (let i = 0; i < resultList.length; i += 1) {
    const result = resultList[i];
    if (result.date.getTime() === latestDate.getTime()) {
      resultMap.set(result.measure, { latest: result });
      measureList.push(result.measure);
    }

    if (result.date.getTime() === baseDate.getTime()) {
      const storedResult = resultMap.get(result.measure);
      storedResult.base = result;
      measureCount += 1;
    }

    if (measureCount === measureList.length) {
      break;
    }
  }

  const finalResult = [];
  for (let i = 0; i < measureList.length; i += 1) {
    const measure = measureList[i];
    const result = resultMap.get(measure);
    let percentChange = 0;
    if (result.base !== undefined) {
      percentChange = Math.round(result.latest.value - result.base.value);
    } else {
      percentChange = 'NA';
    }

    const subScoreTrends = [];
    if (measure !== 'composite') {
      for (let k = 0; k < result.latest.subScores.length; k += 1) {
        const latestSubScore = result.latest.subScores[k];
        if (result.base !== undefined) {
          const baseSubScore = result.base.subScores[k];
          const subScoreChange = Math.round(latestSubScore.value - baseSubScore.value);
          subScoreTrends.push({ measure: latestSubScore.measure, percentChange: subScoreChange });
        } else {
          subScoreTrends.push({ measure: latestSubScore.measure });
        }
      }
    }

    let futurePrediction = {};
    for (let j = 0; j < predictionData.length; j += 1) {
      if (predictionData[j].measure === measure && predictionData[j].Prophet_Predictions) {
        futurePrediction = predictionData[j].Prophet_Predictions.yhat;
        break;
      }
    }

    if (percentChange !== 'NA') {
      finalResult.push({
        measure, percentChange, subScoreTrends, futurePrediction,
      });
    } else {
      finalResult.push({ measure, subScoreTrends, futurePrediction });
    }
  }

  return finalResult;
};

function getOverAllPercentChange(latestResult, baseResult) {
  if (baseResult !== undefined) {
    return Math.round(latestResult.value - baseResult.value);
  }
  return 'NA';
}

function getSubScoreTrends(latestResult, baseResult) {
  const subScoreTrends = [];

  for (let k = 0; k < latestResult.subScores.length; k += 1) {
    const latestSubScore = latestResult.subScores[k];
    if (baseResult !== undefined) {
      const baseSubScore = baseResult.subScores[k];
      const subScoreChange = Math.round(latestSubScore.value - baseSubScore.value);
      subScoreTrends.push({ measure: latestSubScore.measure, percentChange: subScoreChange });
    } else {
      subScoreTrends.push({ measure: latestSubScore.measure });
    }
  }
  return subScoreTrends;
}

const calculateTrend = (memberResults, predictionData, days) => {
  const currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);
  const compareDate = new Date(currentDate - ((days - 1) * 24 * 60 * 60 * 1000));

  const latestResults = calcLatestNumDen(memberResults, currentDate);
  if (latestResults.length === 0) {
    return [];
  }

  const compareMemberResults = memberResults.filter(
    (result) => new Date(result.timeStamp).getTime() < (compareDate.getTime()),
  );

  const baseResults = calcLatestNumDen(compareMemberResults, compareDate);

  const finalResults = [];
  latestResults.forEach((latestResult) => {
    const { measure } = latestResult;
    const baseResult = baseResults.find((base) => base.measure === measure);
    const percentChange = getOverAllPercentChange(latestResult, baseResult);

    let subScoreTrends = [];
    if (measure !== 'composite') {
      subScoreTrends = getSubScoreTrends(latestResult, baseResult);
    }

    const futurePrediction = predictionData.find(
      (prediction) => prediction.measure === measure && prediction.Prophet_Predictions,
    );

    if (percentChange !== 'NA') {
      finalResults.push({
        measure, percentChange, subScoreTrends, futurePrediction,
      });
    } else {
      finalResults.push({ measure, subScoreTrends, futurePrediction });
    }
  });

  return finalResults;
};

module.exports = {
  calculateTrend,
  calculateTrendLegacy,
};
