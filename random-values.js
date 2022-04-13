const randomRanges = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45];
const randomRanges2 = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

findMeasureResults().then((value) => {
  if (value.length === 0) {
    return;
  }
  const sortedList = value.sort((a, b) => b.date - a.date);
  let latestDate = sortedList[0].date;

  const currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  const measureArray = [];
  sortedList.forEach((measure) => {
    if (measure.date.getTime() === latestDate.getTime()) {
      delete measure._id;
      measureArray.push(measure);
    }
  });
  let countCount = 0;
  const newResultList = [];
  while (latestDate < currentDate) {
    const newDate = new Date(latestDate.getTime() + (24 * 60 * 60 * 1000));
    for (let i = 0; i < measureArray.length; i += 1) {
      measureArray[i].date = newDate;
      measureArray[i].denominator = 100;
      const range1 = measureArray[i].measure.startsWith('a') ? randomRanges[countCount % 12] : randomRanges2[countCount % 12];
      const range2 = measureArray[i].measure.startsWith('a') ? randomRanges[(countCount + 4) % 12] : randomRanges2[(countCount + 4) % 12];
      measureArray[i].numerator = randomNumber(range1, range2);
      measureArray[i].starRating = calculateMeasureStarRating({
        numerator: measureArray[i].numerator,
        denominator: measureArray[i].denominator,
      }).starRating;
      measureArray[i].value = (measureArray[i].numerator / measureArray[i].denominator) * 100;
      measureArray[i].exclusions = Math.floor(Math.random() * 20);
      measureArray[i].initialPopulation = Math.floor(Math.random() * 200);
      if (measureArray[i].subScores) {
        for (let k = 0; k < measureArray[i].subScores.length; k += 1) {
          const subScore = measureArray[i].subScores[k];
          subScore.date = newDate;
          subScore.denominator = 100;
          subScore.numerator = randomNumber(randomRanges[countCount % 10], randomRanges[(countCount + 3) % 10]);
          subScore.value = (subScore.numerator / subScore.denominator) * 100;
          subScore.exclusions = Math.floor(Math.random() * 20);
          subScore.initialPopulation = Math.floor(Math.random() * 200);
        }
      }

      newResultList.push(JSON.parse(JSON.stringify(measureArray[i])));
    }
    countCount += 1;
    latestDate = newDate;
  }
  console.log(newResultList);
  insertMeasureResults(newResultList);
});

function randomNumber(var1, var2) {
  if (var1 > var2) {
    return var2 + Math.floor(Math.random() * (var1 - var2));
  }
  return var1 + Math.floor(Math.random() * (var2 - var1));
}
