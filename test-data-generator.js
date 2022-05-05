/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const { v4: uuidv4 } = require('uuid');
const dao = require('./src/config/dao');

const template = {
  aab: {
    subs: 1, type: 'date', gap: 31, newEntry: 'newSingleDate', updateEntry: 'updatedSingleDate',
  },
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
  cise: {
    subs: 13, type: 'bool', newEntry: 'newCISE', updateEntry: 'updateCISE',
  },
  cole: {
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  cou: {
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  // cwp: { subs: 1, type: 'date' },
  dmse: {
    subs: 3, type: 'bool', newEntry: 'newDMSE', updateEntry: 'updateDMSE',
  },
  drre: {
    subs: 3, type: 'bool', newEntry: 'newDRRE', updateEntry: 'updateDRRE',
  },
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
const randomTruerBool = () => Math.random() < 0.7;
const dayOfYear = (date) => Math.floor(
  (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 25,
);
const dateFormatter = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
};
const today = new Date();
const todayOfYear = dayOfYear(today);
const numeratorCheck = (data, index) => (
  (index > 1) ? data[`Numerator ${index}`] && numeratorCheck(data, index - 1) : data[`Numerator ${index}`]
);

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
  newSingleDate: (measure, date, gap) => {
    const { data, id } = dataTemplate(measure, date);
    const days = dayOfYear(date);
    const denominatorDates = [];
    const numeratorDates = [];
    const totalGaps = Math.floor(days / gap);
    if (totalGaps < 0 || randomBool()) { // There are fewer days in the year than a gap.
      const randomDay = dateFormatter(
        new Date(today.getFullYear(), 0, 1 + Math.floor(Math.random() * todayOfYear)),
      );
      denominatorDates.push(randomDay);
      if (randomBool()) {
        numeratorDates.push(randomDay);
      }
    } else { // Multiple days.
      let previousDays = 0;
      let doctorInformed = randomBool();
      for (let i = 0; i < totalGaps; i += 1) {
        if (previousDays + gap > todayOfYear) {
          break;
        }
        if (denominatorDates.length === 0) {
          previousDays = Math.floor(Math.random() * (gap * totalGaps));
        } else if (randomBool()) { // Sometimes stop to generate ranges of 1 thru X.
          break;
        } else {
          previousDays += gap + Math.floor(Math.random() * gap);
        }
        const gapDate = dateFormatter(new Date(today.getFullYear(), 0, 1 + previousDays));
        denominatorDates.push(gapDate);
        if (doctorInformed) {
          numeratorDates.push(gapDate);
        } else {
          doctorInformed = randomBool();
        }
      }
    }
    data[id] = {
      'Initial Population': true,
      Exclusions: randomBool(),
      Denominator: denominatorDates,
      Numerator: numeratorDates,
      id,
    };
    return data;
  },
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
  newDoubleBoolean: (measure, date) => { // Same init pop and denom, differing numerators.
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
  newTripleDependBool: (measure, date) => { // Same init pop and denom, 3rd num depends on prior 2
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
  newCISE: (measure, date) => { // 13 nums, have fun!
    const { data, id } = dataTemplate(measure, date);
    const exclusion = !randomTruerBool();
    data[id] = {};
    for (let i = 1; i < 14; i += 1) { // Not as performant but easier to read.
      data[id][`Initial Population ${i}`] = true;
    }
    for (let i = 1; i < 14; i += 1) {
      data[id][`Exclusion ${i}`] = exclusion;
    }
    for (let i = 1; i < 14; i += 1) {
      data[id][`Denominator ${i}`] = true;
    }
    for (let i = 1; i < 11; i += 1) {
      data[id][`Numerator ${i}`] = randomTruerBool();
    }
    const numerator11 = numeratorCheck(data[id], 7);
    const numerator12 = numerator11 && data[id]['Numerator 8'] && data[id]['Numerator 9'];
    const numerator13 = numerator12 && data[id]['Numerator 10'];
    data[id]['Numerator 11'] = numerator11;
    data[id]['Numerator 12'] = numerator12;
    data[id]['Numerator 13'] = numerator13;
    return data;
  },
  newDMSE: (measure, date) => { // Checks 3 times a year, then denom is always true
    const { data, id } = dataTemplate(measure, date);
    const exclusion = randomBool();
    const initialPop1 = randomBool();
    const initialPop2 = initialPop1 || randomTruerBool();
    const initialPop3 = true;
    data[id] = {
      'Initial Population 1': initialPop1,
      'Initial Population 2': initialPop2,
      'Initial Population 3': initialPop3,
      'Exclusions 1': exclusion,
      'Exclusions 2': exclusion,
      'Exclusions 3': exclusion,
      'Denominator 1': initialPop1,
      'Denominator 2': initialPop2,
      'Denominator 3': initialPop3,
      'Numerator 1': initialPop1 ? randomTruerBool() : false,
      'Numerator 2': initialPop2 ? randomTruerBool() : false,
      'Numerator 3': initialPop3 ? randomTruerBool() : false,
      id,
    };
    return data;
  },
  newDRRE: (measure, date) => { // Checks 3 times a year, then denom is always true
    const { data, id } = dataTemplate(measure, date);
    const exclusion = !randomTruerBool();
    const numerator3 = randomBool(); // Numerator 2 is dependent on 3.
    const numerator2 = numerator3 ? randomTruerBool() : false;
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
      'Numerator 1': true,
      'Numerator 2': numerator2,
      'Numerator 3': numerator3,
      id,
    };
    return data;
  },
};

async function generateData() {
  const newScores = [];
  for (let i = 0; i < 50; i += 1) {
    newScores.push(measureFunctions[template.cise.newEntry]('cise', new Date()));
  }
  // console.log(JSON.stringify(newScores));
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
