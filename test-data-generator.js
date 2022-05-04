/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const { v4: uuidv4 } = require('uuid');
const dao = require('./src/config/dao');

// a-array of dates, b-booleans, p-prime/no sub scores, s-subscores
// All boolean submeasures should be checked for correct denom logic.
// For example, denom 3 == denom 1 && denom 2
const measuresTemplate = {
  // aab: { subs: 1, type: 'date' }, // One episode per 31 days.
  adde: {
    subs: 2, type: 'bool', newEntry: 'newADDE', updateEntry: 'updateADDE',
  },
  aise: {
    subs: 4, type: 'bool', newEntry: 'newAISE', updateEnry: 'updateAISE',
  },
  apme: {
    subs: 3, type: 'bool', newEntry: 'newTripleDependBool', updateEntry: 'updateTripleDependBool',
  },
  asfe: {
    subs: 2, type: 'bool', newEntry: 'newDoubleBool', updateEntry: 'updateDoubleBool',
  },
  bcse: {
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  ccs: {
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  // cise: { subs: 13, type: 'bool' },
  cole: {
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  cou: {
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  // cwp: { subs: 1, type: 'date' },
  // dmse: { subs: 3, type: 'bool' },
  // drre: { subs: 3, type: 'bool' },
  dsfe: {
    subs: 2, type: 'bool', newEntry: 'newDoubleBool', updateEntry: 'updateDoubleBool',
  },
  // fum: { subs: 2, type: 'date' },
  // imae: { subs: 5, type: 'bool' },
  // pdse: { subs: 2, type: 'object' },
  // pnde: { subs: 2, type: 'object' },
  // prse: { subs: 3, type: 'object' },
  psa: {
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  uop: {
    subs: 3, type: 'bool', newEntry: 'newTripleDependBool', updateEntry: 'updateTripleDependBool',
  },
  // uri: { subs: 1, type: 'date' },
};

const randomBool = () => Math.random() < 0.5;

const dataTemplate = (measure, date) => {
  const id = `${measure}-${uuidv4()}`;
  const data = {
    measurementType: measure,
    memberId: id,
    timeStamp: date,
  };
  return { data, id };
};

const measureFunctions = {
  newSingleBool: (measure, date) => { // Single boolean value, nothing interesting.
    const { data, id } = dataTemplate(measure, date);
    data[id] = {
      'Initial Population': true,
      Exclusions: randomBool(),
      Denominator: true,
      Numerator: randomBool(),
      id,
    };
    return data;
  },
  newADDE: (measure, date) => { // Differing initial populations
    const { data, id } = dataTemplate(measure, date);
    const exclusion = randomBool();
    const numerator1 = randomBool();
    const initialPop2 = randomBool();
    const denominator2 = initialPop2 ? randomBool() : false;
    data[id] = {
      'Initial Population 1': true,
      'Initial Population 2': initialPop2,
      'Exclusions 1': exclusion,
      'Exclusions 2': exclusion,
      'Denominator 1': true,
      'Denominator 2': denominator2,
      'Numerator 1': numerator1,
      'Numerator 2': denominator2 && numerator1 ? randomBool() : false,
      id,
    };
    return data;
  },
  newAISE: (measure, date) => { // 4 sub measure, depending on vaccines and age ranges
    const { data, id } = dataTemplate(measure, date);
    const exclusion = randomBool();
    const initialPop3 = randomBool();
    const initialPop4 = initialPop3 ? randomBool() : false;
    data[id] = {
      'Initial Population 1': true,
      'Initial Population 2': true,
      'Initial Population 3': initialPop3,
      'Initial Population 4': initialPop4,
      'Exclusions 1': exclusion,
      'Exclusions 2': exclusion,
      'Exclusions 3': exclusion,
      'Exclusions 4': exclusion,
      'Denominator 1': true,
      'Denominator 2': true,
      'Denominator 3': initialPop3,
      'Denominator 4': initialPop4,
      'Numerator 1': randomBool(),
      'Numerator 2': randomBool(),
      'Numerator 3': initialPop3 ? randomBool() : false,
      'Numerator 4': initialPop4 ? randomBool() : false,
      id,
    };
    return data;
  },
  newTripleDependBool: (measure, date) => { // Third numerator depending on last two
    const { data, id } = dataTemplate(measure, date);
    const exclusion = randomBool();
    const numerator1 = randomBool();
    const numerator2 = randomBool();
    data[id] = {
      'Initial Population 1': true,
      'Initial Population 2': true,
      'Initial Population 3': true,
      'Exclusions 1': exclusion,
      'Exclusions 2': exclusion,
      'Exclusions 3': exclusion,
      'Denominator 1': true,
      'Denominator 2': true,
      'Denominator 3': true,
      'Numerator 1': numerator1,
      'Numerator 2': numerator2,
      'Numerator 3': numerator1 && numerator2,
      id,
    };
    return data;
  },
  newDoubleBoolean: (measure, date) => { // Candidate for double boolean
    const { data, id } = dataTemplate(measure, date);
    const exclusion = randomBool();
    const numerator1 = randomBool();
    const denominator2 = randomBool();
    data[id] = {
      'Initial Population 1': true,
      'Initial Population 2': true,
      'Exclusions 1': exclusion,
      'Exclusions 2': exclusion,
      'Denominator 1': true,
      'Denominator 2': denominator2,
      'Numerator 1': numerator1,
      'Numerator 2': denominator2 && numerator1 ? randomBool() : false,
      id,
    };
    return data;
  },
};

async function generateData() {
  const newScores = [];
  for (let i = 0; i < 5; i += 1) {
    newScores.push(measureFunctions[measuresTemplate.asfe.newEntry]('asfe', new Date()));
  }
  console.log(newScores);
}

async function processData() {
  console.log('Starting');
  // await dao.init();
  // const newScoresList = await generateData();
  generateData();
  // console.log(`\nInfo: ${newScoresList.length} results to be added.`);
  // const insertResults = await dao.insertMeasures(newScoresList);
  // if (!insertResults) {
  //   console.error('\x1b[31mError: Something went wrong during insertion.\x1b[0m');
  //   process.exit();
  // }
  // console.log(`Info: Results are being inserted into DAO. Please wait ${newScoresList.length / 2} seconds for asynchronous completion...`);
  // setTimeout(() => {
  //   console.log('\x1b[32mSuccess: Check database for new insertions.\x1b[0m');
  //   process.exit();
  // }, newScoresList.length * 500);
}

processData();
