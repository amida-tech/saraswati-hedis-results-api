const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { group } = require('console');
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
      const foundPatientPayor = patient.result['Member Coverage'][0].payor[0].reference.value;
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
  // const programsSpecialties = {
  //   // https://reportcards.ncqa.org/clinicians for more details
  //   providersPractitioners: {
  //     programs: [
  //       'Diabetes Recognition Program',
  //       'Heart/Stroke Recognition Program',
  //       'New York State Patient-Centered Medical Home',
  //       'Oncology Medical Home',
  //       'Patient-Centered Connected Care',
  //       'Patient-Centered Medical Home',
  //       'Patient-Centered Specialty Practice',
  //     ],
  //     distinction: ['Distinction in Behavioral Health Integration'],
  //     specialties: [
  //       'Allergy/Immunology',
  //       'Anesthesiology',
  //       'Behavioral Health',
  //       'Cardiology',
  //       'Chiropractor',
  //       'Critical Care Services',
  //       'Dermatology',
  //       'Endocrinology',
  //       'Family Medicine',
  //       'Gastroenterology',
  //       'Gen/Fam Practice',
  //       'Geriatric Medicine',
  //       'Hematology',
  //       'Infectious Disease',
  //       'Internal Medicine',
  //       'Nephrology',
  //       'Neurology',
  //       'Neurosurgery',
  //       'Obstetrics/Gynecology',
  //       'Occ. Medicine',
  //       'Oncology',
  //       'Ophthalmology',
  //       'Orthopedics',
  //       'Other - not listed',
  //       'Otolaryngology',
  //       'Pediatrics',
  //       'Phys/Rehab Medicine',
  //       'Plastic Surgery',
  //       'Preventive Medicine',
  //       'Psychiatry',
  //       'Psychopharmacology',
  //       'Pulmonary Medicine',
  //       'Rheumatology',
  //       'Surgery',
  //       'Urology',
  //     ],
  //   },
  //   payors: {
  //     programs: [
  //       'Case Management',
  //       'Case Management - Long-Term Services and Supports',
  //       'Credentialing',
  //       'Credentials Verification Organization',
  //       'Data Aggregator Validation',
  //       'Disease Management',
  //       'Health Equity Accreditation',
  //       'Health Equity Accreditation Plus',
  //       'Health Information Product',
  //       'Managed Behavioral Healthcare Organization',
  //       'Multicultural Health Care',
  //       'Physician and Hospital Quality',
  //       'Population Health Program',
  //       'Provider Network',
  //       'Utilization Management',
  //       'Wellness and Health Promotion',
  //     ],
  //     distinction: ['Long Term Services and Supports', 'Multicultural Health Care'],
  //   },
  // };
  // const CompanyProfile = [
  //   // Empty Company
  //   {
  //     companyName: 'Amida Technology Solutions',
  //     companyType: '',
  //     classification: '',
  //     address: '',
  //     state: '',
  //     city: '',
  //     zip: '',
  //     phoneNumber: '',
  //     website: 'www.amida.com',
  //     areaServed: 'US: Continental States',
  //     programsSpecialties: {
  //       programs: [],
  //       specialties: [],
  //     },
  //     starRating: 0, // ASK MIKE!
  //     customerReportId: {
  //       npid: 0,
  //       tax_Id: 0,
  //     },
  //     companySettings: {
  //       measureList: [],
  //       providerList: [],
  //       plansList: [],
  //       filters: {
  //         filterClassification: 'Classic', // classic or custom
  //         filterNames: ['Domains of Care', 'Percent Range', 'Star Rating', 'Payors (Payers)', 'Healthcare Providers', 'Healthcare Coverages', 'Healthcare Practitioners'],
  //       },
  //       profileFeatures: {
  //         starRatingAccess: false, // ability to view starRatings
  //         ratingsAndTrendsAccess: false, // ability to view ratings and trends
  //         predictionsAccess: false, // ability to view predictions
  //         tableFiltersAccess: false,
  //         measureAccess: false,
  //         healthcareTypes: {
  //           providersAcesss: false,
  //           plansAccess: false,
  //           practitionersAccess: false,
  //         },
  //         reportsAccess: {
  //           memberInfoAccess: false,
  //           memberPolicyInfoAccess: false,
  //           reportAccess: false,
  //         },
  //       },
  //     },
  //     usersGroups: ['General'], // 'General is the default user, gives them the ability to view the base model of features.
  //     created_on: new Date(Date.now()),
  //     lastUpdated: new Date(Date.now()),
  //     active: true,
  //   },
  //   // Company Already set up
  //   { // company should set up a profile before adding users of roles IMO ask Mike.
  //     companyName: 'New York City Hospital',
  //     companyType: 'Health Care Orginization',
  //     classification: 'Payor',
  //     address: '265 Frost Rd',
  //     state: 'NY',
  //     city: 'Brooklyn',
  //     zip: '11222',
  //     phoneNumber: '8880210247',
  //     website: 'www.healthinsure-ny.com',
  //     areaServed: 'US: Continental States',
  //     programsSpecialties: {
  //       programs: ['New York State Patient-Centered Medical Home'],
  //       specialties: ['Diabetes Recognition Programs'],
  //     },
  //     starRating: 3.5, // ASK MIKE!
  //     customerReportId: {
  //       npid: 212467,
  //       tax_Id: 222008,
  //     },
  //     companySettings: {
  //       measureList: ['aab', 'adde', 'apme', 'asfe', 'bcs', 'ccs', 'cise', 'col', 'cou', 'cwp', 'dmse', 'pdse', 'pnde', 'prse', 'psa', 'uop', 'uri', 'sci', 'dhm', 'dhw'],
  //       providerList: ['Norton Hill Carecenter', 'Cancer Treatment & Care', 'Anova Women\'s Birthing Service', 'Springfield Hospital', 'Hollifield Clinics'],
  //       plansList: ['Health Maintenance Organization (HMO)', 'Preferred Provider Organization (PPO)', 'Exclusive Provider Organization (EPO)', 'Point-of-Service Plan (POS)'],
  //       filters: {
  //         filterClassification: 'Classic', // classic or custom
  //         filterNames: ['Domains of Care', 'Percent Range', 'Star Rating', 'Payors (Payers)', 'Healthcare Providers', 'Healthcare Coverages', 'Healthcare Practitioners'],
  //       },
  //       profileFeatures: {
  //         starRatingAccess: true, // ability to view starRatings
  //         ratingsAndTrendsAccess: true, // ability to view ratings and trends
  //         predictionsAccess: true, // ability to view predictions
  //         tableFiltersAccess: true,
  //         measureAccess: true,
  //         healthcareTypes: {
  //           providersAcesss: true,
  //           plansAccess: true,
  //           practitionersAccess: true,
  //         },
  //         reportsAccess: {
  //           memberInfoAccess: true,
  //           memberPolicyInfoAccess: true,
  //           reportAccess: true,
  //         },
  //       },
  //     },
  //     usersGroups: ['Practitioners', 'Payers/Payor', 'Plans', 'General', 'Admin'], // 'General is the default user, gives them the ability to view the base model of features.
  //     created_on: new Date(Date.now()),
  //     lastUpdated: new Date(Date.now()),
  //     active: true,
  //   },
  // ];
  const testUsers = [
    // SUPER ADMIN
    // {
    //   email: 'testSuperAdmin@amida.com',
    //   firstName: 'Test', // editable
    //   lastName: 'SuperAdmin', // editable
    //   region: 'US - New York',
    //   role: 'Test - SuperAdmin', // if not a test user the role should be either a business User, Business Admin, Super Admin
    //   userGroup: 'Admin', // ask Mike
    //   picture: 'https://lh3.googleusercontent.com/ogw/AOh-ky2QAvQ4d3_vPfYmspbP-WSp1QbutpDbIQNf2skw=s32-c-mo', // from oath object
    //   companyName: 'Amida Technology Solutions', // we can look up company profile by
    //   userSettings: {
    //     measureList: [
    //       'aab',
    //       'adde',
    //       'apme',
    //       'asfe',
    //       'bcs',
    //       'ccs',
    //       'cise',
    //       'col',
    //       'cou',
    //       'cwp',
    //       'dmse',
    //       'pdse',
    //       'pnde',
    //       'prse',
    //       'psa',
    //       'uop',
    //       'uri',
    //     ],
    //     providerList: [
    //       'Hollifield Clinics',
    //       'Norton Hill Carecenter',
    //       'Springfield Hospital',
    //       'Cancer Treatment & Care',
    //       'Anova Women\'s Birthing Service',
    //     ],
    //     plansList: [
    //       'Health Maintenance Organization (HMO)',
    //       'Preferred Provider Organization (PPO)',
    //       'Exclusive Provider Organization (EPO)',
    //       'Point-of-Service Plan (POS)',
    //     ],
    //     filters: {
    //       filterClassification: 'All', // classic or custom OR NONE OR All
    //       filterNames: [ // if custom add custom filter name to filterNames
    //         'Domains of Care',
    //         'Percent Range',
    //         'Star Rating',
    //         'Payors (Payers)',
    //         'Healthcare Providers',
    //         'Healthcare Coverages',
    //         'Healthcare Practitioners',
    //       ],
    //     },
    //     profileFeatures: { // check with company profile for access control
    //       starRatingAccess: true, // ability to view starRatings
    //       ratingsAndTrendsAccess: true, // ability to view ratings and trends
    //       predictionsAccess: true, // ability to view predictions
    //       tableFiltersAccess: true,
    //       measureAccess: true,
    //       healthcareTypes: {
    //         providersAcesss: true,
    //         plansAccess: true,
    //         practitionersAccess: true,
    //       },
    //       reportsAccess: {
    //         memberInfoAccess: true,
    //         memberPolicyInfoAccess: true,
    //         reportAccess: true,
    //       },
    //     },
    //   },
    //   userPreferences: { // all editable
    //     displayMode: 'light',
    //     language: 'EN',
    //     timezone: 'Eastern Standard Time - (EST)',
    //     dateFormat: 'MM/DD/YYYY', // or DD/MM/YYYY
    //     timeFormat: '12-Hour', // or 24-Hour
    //   },
    //   userHistory: {
    //     lastFilters: [], // last filter options user searched with
    //     reportsGenerated: [], // max 15 or 20 entries
    //     notifications: [ // does not get checked for user profiles
    //       {
    //         title: 'New Custom Measure added',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    //         date: new Date(Date.now()),
    //       },
    //       {
    //         title: 'Setup - Incomplete',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    //         date: new Date(Date.now()),
    //       },
    //       {
    //         title: 'You\'ve been added to a new user group',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    //         date: new Date(Date.now()),
    //       },
    //       {
    //         title: 'Your User Profile has been changed',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    //         date: new Date(Date.now()),
    //       },
    //     ],
    //   },
    //   created_on: new Date(Date.now()),
    //   lastUpdated: new Date(Date.now()),
    //   lastLogin: new Date(Date.now()),
    //   active: true,
    // },
    // GENERAL USER
    {
      email: 'testUser@amida.com',
      firstName: 'Test', // editable
      lastName: 'User', // editable
      region: 'US - New York',
      role: 'Test - User', // if not a test user the role should be either a business User, Business Admin, Super Admin
      userGroup: 'General', // ask Mike
      picture: 'https://lh3.googleusercontent.com/ogw/AOh-ky2QAvQ4d3_vPfYmspbP-WSp1QbutpDbIQNf2skw=s32-c-mo', // from oath object
      companyName: 'Amida Technology Solutions', // we can look up company profile by
      // eslint-disable-next-line max-len
      companyPreferences: { // company should set up a profile before adding users of roles IMO ask Mike.
        companyName: 'New York City Hospital',
        companyType: 'Health Care Orginization',
        classification: 'Payor',
        address: '265 Frost Rd',
        state: 'NY',
        city: 'Brooklyn',
        zip: '11222',
        phoneNumber: '8880210247',
        website: 'www.healthinsure-ny.com',
        areaServed: 'US: Continental States',
        programsSpecialties: {
          programs: ['New York State Patient-Centered Medical Home'],
          specialties: ['Diabetes Recognition Programs'],
        },
        starRating: 3.5, // ASK MIKE!
        customerReportId: {
          npid: 212467,
          tax_Id: 222008,
        },
        companySettings: {
          measureList: ['aab', 'adde', 'apme', 'asfe', 'bcs', 'ccs', 'cise', 'col', 'cou', 'cwp', 'dmse', 'pdse', 'pnde', 'prse', 'psa', 'uop', 'uri', 'sci', 'dhm', 'dhw'],
          providerList: ['Norton Hill Carecenter', 'Cancer Treatment & Care', 'Anova Women\'s Birthing Service', 'Springfield Hospital', 'Hollifield Clinics'],
          plansList: ['Health Maintenance Organization (HMO)', 'Preferred Provider Organization (PPO)', 'Exclusive Provider Organization (EPO)', 'Point-of-Service Plan (POS)'],
          filters: {
            filterClassification: 'Classic', // classic or custom
            filterNames: ['Domains of Care', 'Percent Range', 'Star Rating', 'Payors (Payers)', 'Healthcare Providers', 'Healthcare Coverages', 'Healthcare Practitioners'],
          },
          profileFeatures: {
            starRatingAccess: true, // ability to view starRatings
            ratingsAndTrendsAccess: true, // ability to view ratings and trends
            predictionsAccess: true, // ability to view predictions
            tableFiltersAccess: true,
            measureAccess: true,
            healthcareTypes: {
              providersAcesss: true,
              plansAccess: true,
              practitionersAccess: true,
            },
            reportsAccess: {
              memberInfoAccess: true,
              memberPolicyInfoAccess: true,
              reportAccess: true,
            },
          },
        },
        usersGroups: ['Practitioners', 'Payers/Payor', 'Plans', 'General', 'Admin'], // 'General is the default user, gives them the ability to view the base model of features.
        created_on: new Date(Date.now()),
        lastUpdated: new Date(Date.now()),
        active: true,
      },
      userSettings: {
        measureList: ['aab', 'adde', 'apme', 'asfe', 'bcs', 'ccs', 'cise', 'col', 'cou', 'cwp', 'dmse', 'pdse'],
        providerList: ['Norton Hill Carecenter', 'Cancer Treatment & Care', 'Anova Women\'s Birthing Service'],
        plansList: [
          'Health Maintenance Organization (HMO)', 'Preferred Provider Organization (PPO)', 'Exclusive Provider Organization (EPO)',
        ],
        filters: {
          filterClassification: 'Classic', // classic or custom OR NONE
          filterNames: [ // if custom add custom filter name to filterNames
            'Domains of Care',
            'Percent Range',
            'Star Rating',
            'Payors (Payers)',
            'Healthcare Providers',
            'Healthcare Coverages',
            'Healthcare Practitioners',
          ],
        },
        profileFeatures: { // check with company profile for access control
          starRatingAccess: true, // ability to view starRatings
          ratingsAndTrendsAccess: true, // ability to view ratings and trends
          predictionsAccess: true, // ability to view predictions
          tableFiltersAccess: true,
          measureAccess: true,
          healthcareTypes: {
            providersAcesss: true,
            plansAccess: true,
            practitionersAccess: true,
          },
          reportsAccess: {
            memberInfoAccess: true,
            memberPolicyInfoAccess: true,
            reportAccess: true,
          },
        },
      },
      userPreferences: { // all editable
        displayMode: 'light',
        language: 'EN',
        timezone: 'Eastern Standard Time - (EST)',
        dateFormat: 'MM/DD/YYYY', // or DD/MM/YYYY
        timeFormat: '12-Hour', // or 24-Hour
      },
      userHistory: {
        lastFilters: [], // last filter options user searched with
        reportsGenerated: [], // max 15 or 20 entries
        notifications: [ // does not get checked for user profiles
          {
            title: 'New Custom Measure added',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            date: new Date(Date.now()),
          },
          {
            title: 'Setup - Incomplete',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            date: new Date(Date.now()),
          },
          {
            title: 'You\'ve been added to a new user group',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            date: new Date(Date.now()),
          },
          {
            title: 'Your User Profile has been changed',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            date: new Date(Date.now()),
          },
        ],
      },
      created_on: new Date(Date.now()),
      lastUpdated: new Date(Date.now()),
      lastLogin: new Date(Date.now()),
      active: true,
    },
    // BLANK USER
    // {
    //   email: 'testUser2@amida.com',
    //   firstName: '', // editable
    //   lastName: '', // editable
    //   region: '',
    //   role: 'Test - User', // if not a test user the role should be either a business User, Business Admin, Super Admin
    //   userGroup: 'General', // ask Mike
    //   picture: '', // from oath object
    //   companyName: 'Amida Technology Solutions', // we can look up company profile by
    //   userSettings: {
    //     measureList: [],
    //     providerList: [],
    //     plansList: [],
    //     filters: {
    //       filterClassification: 'Classic', // classic or custom OR NONE
    //       filterNames: [ // if custom add custom filter name to filterNames
    //         'Domains of Care',
    //         'Percent Range',
    //         'Star Rating',
    //         'Payors (Payers)',
    //         'Healthcare Providers',
    //         'Healthcare Coverages',
    //         'Healthcare Practitioners',
    //       ],
    //     },
    //     profileFeatures: { // check with company profile for access control
    //       starRatingAccess: true, // ability to view starRatings
    //       ratingsAndTrendsAccess: true, // ability to view ratings and trends
    //       predictionsAccess: true, // ability to view predictions
    //       tableFiltersAccess: true,
    //       measureAccess: true,
    //       healthcareTypes: {
    //         providersAcesss: true,
    //         plansAccess: true,
    //         practitionersAccess: true,
    //       },
    //       reportsAccess: {
    //         memberInfoAccess: true,
    //         memberPolicyInfoAccess: true,
    //         reportAccess: true,
    //       },
    //     },
    //   },
    //   userPreferences: { // all editable
    //     displayMode: 'light',
    //     language: 'EN',
    //     timezone: '',
    //     dateFormat: 'MM/DD/YYYY', // or DD/MM/YYYY
    //     timeFormat: '12-Hour', // or 24-Hour
    //   },
    //   userHistory: {
    //     lastFilters: [], // last filter options user searched with
    //     reportsGenerated: [], // max 15 or 20 entries
    //     notifications: [ // does not get checked for user profiles
    //       {
    //         title: 'Welcome to Your HEDIS Dashboard',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    //         date: new Date(Date.now()),
    //       },
    //     ],
    //   },
    //   created_on: new Date(Date.now()),
    //   lastUpdated: new Date(Date.now()),
    //   lastLogin: new Date(Date.now()),
    //   active: true,
    // },
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
