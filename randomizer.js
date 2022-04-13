/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const starCalculator = require('./src/calculators/StarRatingCalculator');
const measureResultsDao = require('./src/config/dao');

const randomRanges = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45];
const randomRanges2 = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

function randomNumber(var1, var2) {
  if (var1 > var2) {
    return var2 + Math.floor(Math.random() * (var1 - var2));
  }
  return var1 + Math.floor(Math.random() * (var2 - var1));
}

async function generateData() {
  return measureResultsDao.findMeasureResults().then((value) => {
    if (value.length === 0) {
      console.error('\x1b[31m',
        '\nError: No data found.',
        '\x1b[0m');
      process.exit();
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
      const newMeasure = { ...measure };
      if (newMeasure.date.getTime() === latestDate.getTime()) {
        delete newMeasure._id;
        measureArray.push(newMeasure);
      }
    });
    let currentCount = 0;
    const newResultList = [];
    while (latestDate < currentDate) {
      console.log('Adding a daaaay!');
      const newDate = new Date(latestDate.getTime() + (24 * 60 * 60 * 1000));
      for (let i = 0; i < measureArray.length; i += 1) {
        measureArray[i].date = newDate;
        measureArray[i].denominator = 100;
        const range1 = measureArray[i].measure.startsWith('a') ? randomRanges[currentCount % 12] : randomRanges2[currentCount % 12];
        const range2 = measureArray[i].measure.startsWith('a') ? randomRanges[(currentCount + 4) % 12] : randomRanges2[(currentCount + 4) % 12];
        measureArray[i].numerator = randomNumber(range1, range2);
        measureArray[i].starRating = starCalculator.calculateMeasureStarRating({
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
            subScore.numerator = randomNumber(
              randomRanges[currentCount % 10], randomRanges[(currentCount + 3) % 10],
            );
            subScore.value = (subScore.numerator / subScore.denominator) * 100;
            subScore.exclusions = Math.floor(Math.random() * 20);
            subScore.initialPopulation = Math.floor(Math.random() * 200);
          }
        }
        newResultList.push(JSON.parse(JSON.stringify(measureArray[i])));
      }
      currentCount += 1;
      latestDate = newDate;
    }
    return newResultList;
  });
}

async function processData() {
  await measureResultsDao.init();
  const newResultList = await generateData();
  console.log(`\nInfo: ${newResultList.length} results to be added.`);
  const insertResults = await measureResultsDao.insertMeasureResults(newResultList);
  if (!insertResults) {
    console.error('\x1b[31mError: Something went wrong during insertion.\x1b[0m');
    process.exit();
  }
  console.log(`Info: Results are being inserted into DAO. Please wait ${newResultList.length / 2} seconds for asynchronous completion...`);
  setTimeout(() => {
    console.log('\x1b[32mSuccess: Check database for new insertions.\x1b[0m');
    process.exit();
  }, newResultList.length * 500);
}

processData();
