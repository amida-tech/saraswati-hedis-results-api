const calculateTrend = (resultData, days) => {
  const resultList = resultData.sort((a, b) => b.date - a.date);
  const latestDate = resultList[0].date;
  const baseDate = new Date(latestDate.getTime() - (days * 24 * 60 * 60 * 1000));

  let resultMap = new Map();
  let measureList = [];

  for(let i = 0; i < resultList.length; i++) {
    let result = resultList[i];
    if (result.date.getTime() == latestDate.getTime()) {
      resultMap.set(result.measure, { latest: result });
      measureList.push(result.measure);
    }

    if (result.date.getTime() == baseDate.getTime()) {
      var storedResult = resultMap.get(result.measure);
      storedResult.base = result;
    }
  }

  let finalResult = [];
  for(let i = 0; i < measureList.length; i++) {
    let measure = measureList[i];
    let result = resultMap.get(measure);
    let changePercent = Math.round(((result.latest.value - result.base.value) / result.latest.value) * 100);

    finalResult.push( { measure, changePercent })
  }

  return finalResult;

}

module.exports = {
  calculateTrend,
};