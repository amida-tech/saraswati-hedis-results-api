const cron = require('node-cron');
const config = require('./config/config');
const winstonInstance = require('./config/winston');
const app = require('./config/express.js');
const dao = require('./config/dao');
const { calcLatestNumDen } = require('./calculators/NumDenCalculator');
const consumer = require('./consumer/consumer');

async function calculateData() {
  let measureResults = await dao.findMeasureResults();

  const currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  let latestDate;
  // If there are records, use the latest one to get the date.
  // If there are no records, set the latest date as yesterday to calculate today
  if (measureResults.length !== 0) {
    measureResults = measureResults.sort((a, b) => b.date - a.date);
    latestDate = measureResults[0].date;
    // If the latestDate is today, push this back one day to force a recalculation of today
    if (latestDate.getTime() === currentDate.getTime()) {
      latestDate = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
    }
  } else {
    latestDate = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
  }

  const patientResults = await dao.findMembers();
  const hedisResults = calcLatestNumDen(patientResults, currentDate);
  const fullResultList = [];
  // Store results for each day until it's caught up to today
  while (latestDate.getTime() < currentDate.getTime()) {
    const newLatestDate = new Date(latestDate.getTime() + (24 * 60 * 60 * 1000));
    hedisResults.forEach((result) => {
      const newResult = { ...result };
      newResult.date = newLatestDate;
      if (newResult.subScores) {
        newResult.subScores.forEach((subscore, index) => {
          const newSubScore = { ...subscore };
          newSubScore.date = newLatestDate;
          newResult.subScores[index] = newSubScore;
        });
      }
      fullResultList.push(JSON.parse(JSON.stringify(newResult)));
    });
    latestDate = new Date(newLatestDate);
  }

  dao.insertMeasureResults(fullResultList);
}

dao.init().then(() => {
  if (config.kafkaConfig.active) {
    consumer.kafkaRunner();
  }
  app.listen(config.port, () => {
    winstonInstance.info(`server started on port ${config.port} (${config.env})`, {
      port: config.port,
      node_env: config.env,
    });
    if (config.calculation.active) {
      calculateData();
      cron.schedule(config.calculation.schedule, () => {
        calculateData();
      });
    }
  });
});

module.exports = app;
