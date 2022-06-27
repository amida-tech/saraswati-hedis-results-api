const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const config = require('./config/config');
const winstonInstance = require('./config/winston');
const app = require('./config/express.js');
const dao = require('./config/dao');
const { calcLatestNumDen } = require('./calculators/NumDenCalculator');
const consumer = require('./consumer/consumer');
const { createInfoObject } = require('./utilities/infoUtil');

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

  const infoList = await dao.findInfo();
  const measureInfo = createInfoObject(infoList);

  const hedisResults = calcLatestNumDen(patientResults, measureInfo, currentDate);

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

async function healthcareProvidersPayorsGenerator() {
  const patientResults = await dao.findMembers();
  // PROVIDERS
  // console.log('patientResults', patientResults.forEach((patient) => console.log(patient.providers)));
  // console.log('patientResults', patientResults.forEach((patient) => console.log(patient)));

  // THIS GIVES US RESULTS LIKE PPO and MANAGED CARE POLICY
  // console.log("patientResults",patientResults.forEach((patient)=> {
  //   if(patient.coverage && patient.coverage.length > 0){
  //    patient.coverage[0].type.coding.forEach((item)=>console.log(item.display))
  //   }
  // }))

  // PAYORS
  console.log("patientResults", patientResults.forEach((patient)=> {
    if(patient.coverage && patient.coverage.length > 0){
      //  console.log(patient.coverage[0].payor)
       console.log(patient.coverage[0].payor[0]['reference']["value"])
      }})
  )

  // dao.insertMeasureResults(fullResultList);
}
async function initHedisInfo() {
  let infoList = await dao.findInfo();
  if (infoList.length === 0) {
    const hedisInfoLocation = `${path.resolve()}/${config.infoLocation}`;
    try {
      infoList = JSON.parse(fs.readFileSync(hedisInfoLocation));
      await dao.insertInfo(infoList);
    } catch (e) {
      winstonInstance.error(`Unable to upload data from ${hedisInfoLocation}`);
    }
  }
}
async function prepareDatabase() {
  await initHedisInfo();
  if (config.providers_payors.active) {
    healthcareProvidersPayorsGenerator();
    // cron.schedule(config.providers_payors.schedule, () => {
    //   healthcareProvidersPayorsGenerator();
    // });
  }
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
    prepareDatabase();
  });
});

module.exports = app;
