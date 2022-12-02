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
      winstonInstance.error(e);
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
      winstonInstance.error(e);
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
      winstonInstance.error(e);
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
      winstonInstance.error(e);
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
async function initUsers() {
  // First user added is the test user just to check and see if user exist.

  const testUsers = [
    {
      email: 'testSuperAdmin@amida.com',
      firstName: 'Test', // editable
      lastName: 'User', // editable
      role: 'Test - SuperAdmin',
      companyName: 'Amida Technology Solutions',
      // companyRef: 1, // =====> "point to that company"
      companyPreferences: {
        companyType: 'Amida - Healthcare Provider',
        state: 'FL',
        region: 'US', // see abena
        starRating: 4,
        // AccreditaionStatus: "",
        // Accreditaions: [],
        address: 'rando address',
        phoneNumber: '6308928349',
        measureList: ['aab', 'adde', 'apme', 'asfe', 'bcs', 'ccs', 'cise', 'col', 'cou', 'cwp', 'dmse', 'pdse', 'pnde', 'prse', 'psa', 'uop', 'uri', 'sci', 'dhm', 'dhw'],
        providerList: ['Norton Hill Carecenter', 'Cancer Treatment & Care', 'Anova Women\'s Birthing Service', 'Springfield Hospital', 'Hollifield Clinics'],
        plansList: ['Health Maintenance Organization (HMO)', 'Preferred Provider Organization (PPO)', 'Exclusive Provider Organization (EPO)', 'Point-of-Service Plan (POS)'],
        customFilters: {
          filterType: ['All'], // hybrid or classic or custom or all
          filters: ['Domains of Care', 'Percent Range', 'Star Rating', 'Payors (Payers)', 'Healthcare Providers', 'Healthcare Coverages', 'Healthcare Practitioners'],
        },
        starRatingAccess: true, // ability to view starRatings
        ratingsAndTrendsAccess: true, // ability to view ratings and trends
        predictionsAccess: true, // ability to view predictions
        tableFiltersAccess: true,
        reportsAccess: {
          memberInfoAccess: true,
          memberPolicyInfoAccess: true,
          reportAccess: true,
        },
        lastUpdated: Date.now(),
      },
      userPreferences: {
        measureList: ['aab', 'adde', 'apme', 'asfe', 'bcs', 'ccs', 'cise', 'col', 'cou', 'cwp', 'dmse', 'pdse', 'pnde', 'prse', 'psa', 'uop', 'uri', 'sci', 'dhm', 'dhw'],
        providerList: ['Norton Hill Carecenter', 'Cancer Treatment & Care', 'Anova Women\'s Birthing Service', 'Springfield Hospital', 'Hollifield Clinics'],
        plansList: ['Health Maintenance Organization (HMO)', 'Preferred Provider Organization (PPO)', 'Exclusive Provider Organization (EPO)', 'Point-of-Service Plan (POS)'],
        customFilters: {
          filterType: ['All'], // hybrid or classic or custom
          filters: ['Domains of Care', 'Percent Range', 'Star Rating', 'Payors (Payers)', 'Healthcare Providers', 'Healthcare Coverages', 'Healthcare Practitioners'],
        },
        profilePicture: 'picture',
        darkLightMode: 'light',
        reportsGenerated: [
          {
            paitientID: 'paitient ID 1',
            date: new Date(),
          },
          {
            paitientID: 'paitient ID 2',
            date: new Date(),
          },
        ], // max 15 or 20 entries
        starRatingAccess: true, // ability to view starRatings
        ratingsAndTrendsAccess: true, // ability to view ratings and trends
        predictionsAccess: true, // ability to view predictions
        tableFiltersAccess: true,
        reportsAccess: {
          memberInfoAccess: true,
          memberPolicyInfoAccess: true,
          reportAccess: true,
        },
        lastFilter: [
          {
            filterMeasure: false,
            Measure: null,
            filterValues: [
              {
                domainsOfCare: [],
                stars: [1],
                percentRange: [0, 100],
                payors: ['Organization/2'],
                healthcareProviders: [],
                healthcareCoverages: [],
                healthcarePractitioners: ['Dr. Colette DeBarge'],
                sum: 3,
              },
            ],
          },
        ], // last filter options user searched with
        timezone: 'EST',
      },
      created_on: new Date(),
      updated_on: new Date(),
      lastLogin: new Date(),
      active: true,
    },
    {
      email: 'testUser@amida.com',
      firstName: '', // editable
      lastName: '', // editable
      role: 'Test - User',
      companyName: 'Amida Technology Solutions',
      // companyRef: 1, // =====> "point to company"
      companyPreferences: {
        companyType: 'Amida - Healthcare Provider',
        state: 'FL',
        region: 'US', // see abena
        starRating: 4,
        // AccreditaionStatus: "",
        // Accreditaions: [],
        address: 'rando address',
        phoneNumber: '6308928349',
        measureList: ['aab', 'adde', 'apme', 'asfe', 'bcs', 'ccs', 'cise', 'col', 'cou', 'cwp', 'dmse', 'pdse', 'pnde', 'prse', 'psa', 'uop', 'uri', 'sci', 'dhm', 'dhw'],
        providerList: ['Norton Hill Carecenter', 'Cancer Treatment & Care', 'Anova Women\'s Birthing Service', 'Springfield Hospital', 'Hollifield Clinics'],
        plansList: ['Health Maintenance Organization (HMO)', 'Preferred Provider Organization (PPO)', 'Exclusive Provider Organization (EPO)', 'Point-of-Service Plan (POS)'],
        customFilters: {
          filterType: ['All'], // hybrid or classic or custom
          filters: ['Domains of Care', 'Percent Range', 'Star Rating', 'Payors (Payers)', 'Healthcare Providers', 'Healthcare Coverages', 'Healthcare Practitioners'],
        },
        starRatingAccess: true, // ability to view starRatings
        ratingsAndTrendsAccess: true, // ability to view ratings and trends
        predictionsAccess: true, // ability to view predictions
        tableFiltersAccess: true,
        reportsAccess: {
          memberInfoAccess: true,
          memberPolicyInfoAccess: true,
          reportAccess: true,
        },
        lastUpdated: Date.now(),
      },
      userPreferences: {
        measureList: [],
        providerList: [],
        plansList: [],
        customFilters: {
          filterType: ['All'], // hybrid or classic or custom OR NONE
          filters: ['Domains of Care', 'Percent Range', 'Star Rating', 'Payors (Payers)', 'Healthcare Providers', 'Healthcare Coverages', 'Healthcare Practitioners'],
        },
        profilePicture: '',
        darkLightMode: 'light',
        reportsGenerated: [], // max 15 or 20 entries
        starRatingAccess: false, // ability to view starRatings
        ratingsAndTrendsAccess: false, // ability to view ratings and trends
        predictionsAccess: false, // ability to view predictions
        tableFiltersAccess: false,
        reportsAccess: {
          memberInfoAccess: false,
          memberPolicyInfoAccess: false,
          reportAccess: false,
        },
        lastFilter: [], // last filter options user searched with
        timezone: '',
      },
      created_on: new Date(),
      updated_on: new Date(),
      lastLogin: new Date(),
      active: true,
    },
  ];

  try {
    const usersInDB = await dao.getUsers();
    if (usersInDB.length === 0) {
      testUsers.forEach(async (testUser) => {
        const insertTestUser = await dao.addUsers(testUser);
        // IF TEST USER ADDED SUCCESSFULLY
        if (insertTestUser.insertedCount > 0) {
          winstonInstance.info(`Test user: ${testUser.email}, inserted into users database with: "${testUser.role}" as their role`);
        } else {
          // IF TEST USER FAILS TO INSERT
          winstonInstance.info('User database active');
        }
      });
    } else {
      // IF USER DB EXIST
      winstonInstance.info('User database ready');
    }
  } catch (error) {
    winstonInstance.error(error);
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
  if (config.testUsersActive) {
    await initUsers();
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
