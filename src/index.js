const cron = require('node-cron');
const config = require('./config/config');
const winstonInstance = require('./config/winston');
const app = require('./config/express.js');
const dao = require('./config/dao');
const { calcLatestNumDen } = require('./calculators/NumDenCalculator');
const consumer = require('./consumer/consumer');

async function calculateData() {
  const measureResults = await dao.findMeasureResults();

  const currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);
  
  let latestDate;
  // If there are records, use the latest one to get the date.
  // If there are no records, set the latest date as yesterday to calculate today
  if (measureResults.length !== 0) {
    const sortedList = measureResults.sort((a, b) => b.date - a.date);
    latestDate = sortedList[0].date;
  } else {
    latestDate = new Date(latestDate.getTime() - (24 * 60 * 60 * 1000));
  }

  const patientResults = await dao.findMeasures();
  const hedisResults = calcLatestNumDen(patientResults);
  const fullResultList = [];
  // Store results for each day until it's caught up to today
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

  dao.insertMeasureResults(fullResultList);
}

dao.init().then(() => {
  consumer.kafkaRunner();
  app.listen(config.port, () => {
    winstonInstance.info(`server started on port ${config.port} (${config.env})`, {
      port: config.port,
      node_env: config.env,
    });
    calculateData();
    cron.schedule('0 * * * *', () => {
      calculateData();
    });
  });
});

module.exports = app;
