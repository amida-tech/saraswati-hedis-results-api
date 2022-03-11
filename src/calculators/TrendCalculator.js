const calculateTrend = (resultData, predictionData, days) => {
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
    let changePercent = 0;
    if (result.base !== undefined) {
      changePercent = Math.round(
        ((result.latest.value - result.base.value) / result.base.value) * 100,
      );
    }
    let futurePrediction = {};
    for (let j = 0; j < predictionData.length; j += 1) {
      if (predictionData[j].measure === measure && predictionData[j].Prophet_Predictions) {
        futurePrediction = predictionData[j].Prophet_Predictions.yhat;
        break;
      }
    }

    finalResult.push({ measure, changePercent, futurePrediction });
  }

  return finalResult;
};

module.exports = {
  calculateTrend,
};
