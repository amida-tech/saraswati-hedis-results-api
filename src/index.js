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

async function healthcareProvidersPayorsGenerator() {
  const patientResults = await dao.findMembers();
  // PROVIDERS
  const healthcareProviderOptions = [];
  const practitionerOptions = [];
  const coverageOptions = [];
  const payorOptions = [];

  patientResults.forEach((patient) => {
    const foundhealthcareProviderOptions = patient.providers;
    const foundPatientCoverage = patient.coverage;
    if (foundhealthcareProviderOptions && foundhealthcareProviderOptions.length > 0) {
      foundhealthcareProviderOptions.forEach((foundOption) => {
        const { reference } = foundOption;
        const { display } = foundOption;
        if (reference.includes('Organization')) {
          const filteredHealthcareProviderOptions = healthcareProviderOptions
            .filter((provider) => provider.display === display);
          if (filteredHealthcareProviderOptions.length < 1) {
            healthcareProviderOptions.push({ display, reference });
          }
        } else if (reference.includes('Practitioner')) {
          const filteredPractitionerOptions = practitionerOptions
            .filter((practitioner) => practitioner.display === display);
          if (filteredPractitionerOptions.length < 1) {
            practitionerOptions.push({ display, reference });
          }
        }
      });
    }
    // THIS GIVES US RESULTS LIKE PPO and MANAGED CARE POLICY
    if (foundPatientCoverage && foundPatientCoverage.length > 0) {
      foundPatientCoverage[0].type.coding.forEach((item) => {
        const foundCoverage = item.display.value;
        const foundValue = item.code.value;
        const filteredOptions = coverageOptions
          .filter((coverage) => coverage.foundCoverage === foundCoverage);
        if (filteredOptions.length < 1) {
          coverageOptions.push({ foundCoverage, foundValue });
        }
      });
      const foundPayors = foundPatientCoverage[0].payor[0].reference.value;
      const filteredOptions = payorOptions.filter((payors) => payors === foundPayors);
      if (filteredOptions.length < 1) {
        payorOptions.push(foundPayors);
      }
    } else {
      const foundPatientPayor = patient[patient.memberId]['Member Coverage'][0].payor[0].reference.value;
      if (foundPatientPayor) {
        const modifiedFilteredOptions = payorOptions
          .filter((payors) => payors === foundPatientPayor);
        if (modifiedFilteredOptions.length < 1) {
          payorOptions.push(foundPatientPayor);
        }
      }
    }
  });
  for (let i = 0; i < payorOptions.length; i += 1) {
    try {
      dao.insertPayors({
        payor: payorOptions[i],
        value: payorOptions[i],
        timestamp: new Date(Date.now()),
      });
    } catch (e) {
      winstonInstance.error(e)
    }
  }
  for (let i = 0; i < practitionerOptions.length; i += 1) {
    try {
      dao.insertPractitioner({
        practitioner: practitionerOptions[i].display,
        value: practitionerOptions[i].reference,
        timestamp: new Date(Date.now()),
      });
    } catch (e) {
      winstonInstance.error(e)
    }
  }
  for (let i = 0; i < healthcareProviderOptions.length; i += 1) {
    try {
      dao.insertHealthcareProviders({
        provider: healthcareProviderOptions[i].display,
        value: healthcareProviderOptions[i].reference,
        timestamp: new Date(Date.now()),
      });
    } catch (e) {
      winstonInstance.error(e)
    }
  }
  for (let i = 0; i < coverageOptions.length; i += 1) {
    try {
      dao.insertHealthcareCoverage({
        coverage: coverageOptions[i].foundCoverage,
        value: coverageOptions[i].foundValue,
        timestamp: new Date(Date.now()),
      });
    } catch (e) {
      winstonInstance.error(e)
    }
  }
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
    cron.schedule(config.providers_payors.schedule, () => {
      healthcareProvidersPayorsGenerator();
    });
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
