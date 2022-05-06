/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const { v4: uuidv4 } = require('uuid');
const minimist = require('minimist');
const fs = require('fs');
const dao = require('./src/config/dao');

const parseArgs = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    i: 'include',
    s: 'size',
    o: 'output',
  },
});

const template = {
  aab: {
    subs: 1, type: 'date', gap: 31, newEntry: 'newSingleDate', updateEntry: 'updatedSingleDate',
  },
  adde: {
    subs: 2, type: 'bool', newEntry: 'newADDE', updateEntry: 'updateADDE',
  },
  aise: {
    subs: 4, type: 'bool', newEntry: 'newAISE', updateEntry: 'updateAISE',
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
  cwp: {
    subs: 1, type: 'date', gap: 31, newEntry: 'newSingleDate', updateEntry: 'updatedSingleDate',
  },
  dmse: {
    subs: 3, type: 'bool', newEntry: 'newDMSE', updateEntry: 'updateDMSE',
  },
  drre: {
    subs: 3, type: 'bool', newEntry: 'newDRRE', updateEntry: 'updateDRRE',
  },
  dsfe: {
    subs: 2, type: 'bool', newEntry: 'newDoubleBool', updateEntry: 'updateDoubleBool',
  },
  fum: {
    subs: 2, type: 'date', gap: 31, newEntry: 'newFUM', updateEntry: 'updateFUM',
  },
  imae: {
    subs: 5, type: 'bool', newEntry: 'newIMAE', updateEntry: 'updateIMAE',
  },
  pdse: {
    subs: 2, type: 'object', newEntry: 'newDoubleDeliveries', updateEntry: 'updateDoubleDeliveries',
  },
  pnde: {
    subs: 2, type: 'object', newEntry: 'newDoubleDeliveries', updateEntry: 'updateDoubleDeliveries',
  },
  prse: {
    subs: 3, type: 'object', newEntry: 'newPRSE', updateEntry: 'updatePRSE',
  },
  psa: {
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  uop: {
    subs: 3, type: 'bool', newEntry: 'newTripleDependBool', updateEntry: 'updateTripleDependBool',
  },
  uri: {
    subs: 1, type: 'date', gap: 31, newEntry: 'newSingleDate', updateEntry: 'updateSingleDate',
  },
};

const measureList = Object.keys(template);

const randomBool = () => Math.random() < 0.5;
const randomTruerBool = () => Math.random() < 0.7;
const randomTruestBool = () => Math.random() < 0.9;
const dayOfYear = (date) => Math.floor(
  (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24,
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

const scoreTemplate = (measure, date) => {
  const id = `${measure}-${uuidv4()}`;
  const data = {
    measurementType: measure,
    memberId: id,
    timeStamp: date,
  };
  return { data, id };
};

const dateGenerator = (date, gap) => {
  const days = dayOfYear(date);
  const initialPopDates = [];
  const numeratorDates = [];
  const exclusionDates = [];
  const totalGaps = Math.floor(days / gap);
  if (totalGaps < 0 || randomBool()) { // There are fewer days in the year than a gap.
    const randomDay = dateFormatter(
      new Date(today.getFullYear(), 0, 1 + Math.floor(Math.random() * todayOfYear)),
    );
    initialPopDates.push(randomDay);
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
      if (initialPopDates.length === 0) {
        previousDays = Math.floor(Math.random() * (gap * totalGaps));
      } else if (randomBool()) { // Sometimes stop to generate ranges of 1 thru X.
        break;
      } else {
        previousDays += gap + Math.floor(Math.random() * gap);
      }
      const gapDate = dateFormatter(new Date(today.getFullYear(), 0, 1 + previousDays));
      initialPopDates.push(gapDate);
      if (doctorInformed) {
        numeratorDates.push(gapDate);
      } else {
        doctorInformed = randomBool();
      }
      if (!randomTruerBool()) {
        exclusionDates.push(gapDate);
      }
    }
  }
  return { initialPopDates, exclusionDates, numeratorDates };
};

const deliveryGenerator = (measure) => ({
  status: {
    value: 'complete',
  },
  id: {
    value: `procedure-${measure}-${uuidv4()}`,
  },
});

const measureFunctions = {
  newSingleDate: (measure, date) => {
    const { gap } = template[measure];
    const { data, id } = scoreTemplate(measure, date);
    const { initialPopDates, exclusionDates, numeratorDates } = dateGenerator(date, gap);
    data[id] = {
      'Initial Population': initialPopDates,
      Exclusions: exclusionDates,
      Denominator: initialPopDates,
      Numerator: numeratorDates,
      id,
    };
    return data;
  },
  newSingleBool: (measure, date) => { // Single boolean value, nothing interesting.
    const { data, id } = scoreTemplate(measure, date);
    data[id] = {
      'Initial Population': true,
      Exclusions: randomBool(),
      Denominator: true,
      Numerator: randomBool(),
      id,
    };
    return data;
  },
  newDoubleBool: (measure, date) => { // Same init pop and denom, differing numerators.
    const { data, id } = scoreTemplate(measure, date);
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
    const { data, id } = scoreTemplate(measure, date);
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
  newDoubleDeliveries: (measure, date) => {
    const { data, id } = scoreTemplate(measure, date);
    const initialPop1 = [deliveryGenerator()];
    const exclusion = randomBool() ? initialPop1 : [];
    const denominator2 = randomTruerBool() ? initialPop1 : [];
    const numerator1 = denominator2.length > 0 && randomTruerBool() ? initialPop1 : [];
    data[id] = {
      'Initial Population 1': initialPop1,
      'Initial Population 2': initialPop1,
      'Exclusions 1': exclusion,
      'Exclusions 2': exclusion,
      'Denominator 1': initialPop1,
      'Denominator 2': denominator2,
      'Numerator 1': numerator1,
      'Numerator 2': numerator1 && randomTruerBool() ? numerator1 : [],
      id,
    };
    return data;
  },
  newADDE: (measure, date) => { // Differing initial populations
    const { data, id } = scoreTemplate(measure, date);
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
    const { data, id } = scoreTemplate(measure, date);
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
    const { data, id } = scoreTemplate(measure, date);
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
    const { data, id } = scoreTemplate(measure, date);
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
    const { data, id } = scoreTemplate(measure, date);
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
  newFUM: (measure, date) => { // One for 30 day gap, another for 7.
    const { gap } = template[measure];
    const { data, id } = scoreTemplate(measure, date);
    const { initialPopDates, exclusionDates, numeratorDates } = dateGenerator(date, gap);
    const numerator2Dates = Array.from(numeratorDates);
    if (!randomTruerBool()) {
      numerator2Dates.splice(Math.floor(Math.random(numeratorDates.length) * numeratorDates), 1);
    }
    data[id] = {
      'Initial Population': initialPopDates,
      'Initial Population2': initialPopDates,
      'Exclusions 1': exclusionDates,
      'Exclusions 2': exclusionDates,
      'Denominator 1': initialPopDates,
      'Denominator 2': initialPopDates,
      'Numerator 1': numeratorDates,
      'Numerator 2': numerator2Dates,
      id,
    };
    return data;
  },
  newIMAE: (measure, date) => { // 4 is based on 1, 2, and 5 on 1, 2, 3
    const { data, id } = scoreTemplate(measure, date);
    const exclusion = !randomTruerBool();
    data[id] = {};
    for (let i = 1; i < 6; i += 1) { // Not as performant but easier to read.
      data[id][`Initial Population ${i}`] = true;
    }
    for (let i = 1; i < 6; i += 1) {
      data[id][`Exclusion ${i}`] = exclusion;
    }
    for (let i = 1; i < 6; i += 1) {
      data[id][`Denominator ${i}`] = true;
    }
    for (let i = 1; i < 4; i += 1) {
      data[id][`Numerator ${i}`] = randomTruerBool();
    }
    const numerator4 = data[id]['Numerator 1'] && data[id]['Numerator 2'];
    data[id]['Numerator 4'] = numerator4;
    data[id]['Numerator 5'] = numerator4 && data[id]['Numerator 3'];
    return data;
  },
  newPRSE: (measure, date) => {
    const { data, id } = scoreTemplate(measure, date);
    const initialPop1 = [deliveryGenerator()];
    const exclusion = randomBool() ? initialPop1 : [];
    const numerator1 = randomTruestBool() ? initialPop1 : [];
    const numerator2 = randomTruestBool() ? initialPop1 : [];
    data[id] = {
      'Initial Population 1': initialPop1,
      'Initial Population 2': initialPop1,
      'Initial Population 3': initialPop1,
      'Exclusions 1': exclusion,
      'Exclusions 2': exclusion,
      'Exclusions 3': exclusion,
      'Denominator 1': initialPop1,
      'Denominator 2': initialPop1,
      'Denominator 3': initialPop1,
      'Numerator 1': numerator1,
      'Numerator 2': numerator2,
      'Numerator 3': numerator1.length === numerator2.length ? initialPop1 : [],
      id,
    };
    return data;
  },
};

async function generateData() {
  const scoreAmount = parseArgs.s || 300;
  console.log(`\n\x1b[33mInfo:\x1b[0m Starting test data generation for ${scoreAmount} scores.`);
  const newScores = [];
  let measure;
  for (let i = 0; i < scoreAmount; i += 1) {
    measure = measureList[i % measureList.length];
    newScores.push(measureFunctions[template[measure].newEntry](measure, new Date()));
  }
  return newScores;
}

function outputData(newScoresList) {
  let fileTitle = `saraswati-test-data_${today.getMonth()}-${today.getDate()}-${today.getFullYear()}`;
  fileTitle += `_${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}.json`;

  try {
    fs.writeFileSync(fileTitle, JSON.stringify(newScoresList, null, 4));
  } catch (writeErr) {
    console.error(`\x1b[31mError:\x1b[0m Unable to write to directory:${writeErr}.`);
    process.exit();
  }
  console.log(`\x1b[32mSuccess:\x1b[0m Check ${fileTitle} for new data.`);
  process.exit();
}

async function processData() {
  await dao.init();
  const newScoresList = await generateData();
  console.log(`\x1b[33mInfo:\x1b[0m ${newScoresList.length} scores to be inserted.`);
  const insertResults = await dao.insertMeasures(newScoresList);
  if (parseArgs.o) {
    outputData(newScoresList);
  }
  if (!insertResults) {
    console.error('\x1b[31mError:\x1b[0m Something went wrong during insertion.');
    process.exit();
  }
  console.log(`\x1b[33mInfo:\x1b[0m Results are being inserted into DAO. Please wait ${newScoresList.length / 10} seconds for asynchronous completion...`);
  setTimeout(() => {
    console.log('\x1b[32mSuccess:\x1b[0m Check database for new insertions.');
    process.exit();
  }, newScoresList.length * 10);
}

if (parseArgs.h === true) {
  console.log('\n A script for generated fake HEDIS scores for Saraswati.\n\n Options:');
  console.log('   -h, --help: Help command. What you\'re reading now...\n');
  console.log('   -i, --include: A spaceless, comma separated of measures to create. Default is to use all. Valid options are: ');
  console.log(`\t${measureList.join(', ')}`);
  console.log('   -s, --size: The number of produced HEDIS measurement scores. Default is 300.');
  console.log('   -o, --output: Instead of inserting into database, writes output to the file "saraswati-test-data" with a datetime stamp.');
  process.exit();
}

processData();
