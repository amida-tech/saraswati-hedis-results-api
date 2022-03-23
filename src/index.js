const config = require('./config/config');
const winstonInstance = require('./config/winston');
const app = require('./config/express.js');
const { init, findMeasures, findMeasureResults, insertMeasureResults } = require('./config/dao');
const { calculateMeasureStarRating } = require('./calculators/StarRatingCalculator');
const { calcLatestNumDen } = require('./calculators/NumDenCalculator');
const consumer = require('./consumer/consumer');

init().then(() => {
  consumer.kafkaRunner();
  app.listen(config.port, () => {
    winstonInstance.info(`server started on port ${config.port} (${config.env})`, {
      port: config.port,
      node_env: config.env,
    });
    calculateData();
  });
});

async function calculateData() {
  const measureResults = await findMeasureResults();
  const sortedList = measureResults.sort((a, b) => b.date - a.date);
  let latestDate = sortedList[0].date;

  const currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);
  if(latestDate.getTime() >= currentDate.getTime()) {
    return;
  }
  const patientResults = await findMeasures();
  const hedisResults = calcLatestNumDen(patientResults);
  const fullResultList = [];
  while (latestDate.getTime() < currentDate.getTime()) {
    latestDate = new Date(latestDate.getTime() + (24 * 60 * 60 * 1000));
    hedisResults.forEach((result) => {
      result.date = latestDate;
      if (result.subScores) {
        result.subScores.forEach((subscore) => {
          subscore.date = latestDate;
        });
      }
      fullResultList.push(JSON.parse(JSON.stringify(result)));
    });
  }

  insertMeasureResults(fullResultList);
  console.log(fullResultList);
}

module.exports = app;
