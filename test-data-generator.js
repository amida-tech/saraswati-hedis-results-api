/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const { v4: uuidv4 } = require('uuid');
const minimist = require('minimist');
const fs = require('fs');
const dao = require('./src/config/dao');
const { template, coveragePlans, providerOptions } = require('./test-data-settings');

const parseArgs = minimist(process.argv.slice(2), {
  alias: {
    d: 'days',
    h: 'help',
    i: 'include',
    o: 'output',
  },
});

const randomOf100 = () => Math.random() * 100;
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

const newScoreTemplate = (measure, date) => {
  const id = `${measure}-${uuidv4()}`;
  const coverageChosen = Math.floor(Math.random() * coveragePlans.length);

  const periodDate = new Date(date.toDateString());
  periodDate.setFullYear(date.getFullYear() - 1);
  const periodStart = dateFormatter(periodDate);
  periodDate.setFullYear(date.getFullYear() + 1);
  const periodEnd = dateFormatter(periodDate);

  const providerChoices = providerOptions.filter((provider) => provider.measures.includes(measure));
  const data = {
    measurementType: measure,
    memberId: id,
    timeStamp: date.toISOString(),
    coverage: [{
      status: { value: 'active' },
      type: {
        coding: [{
          system: { value: 'http://terminology.hl7.org/CodeSystem/v3-ActCode' },
          code: { value: coveragePlans[coverageChosen].code },
          display: { value: coveragePlans[coverageChosen].display },
        }],
      },
      subscriber: {
        reference: { value: `Patient/${id}` },
      },
      beneficiary: {
        reference: { value: `Patient/${id}` },
      },
      relationship: {
        coding: [{
          code: { value: 'self' },
        }],
      },
      period: {
        start: { value: periodStart },
        end: { value: periodEnd },
      },
      payor: [{
        reference: { value: `Organization/${Math.floor(Math.random() * 3 + 1)}` },
      }],
      id: { value: uuidv4() },
    }],
    providers: providerChoices[Math.floor(Math.random() * providerChoices.length)].providers,
  };
  return { data, id };
};

const updateScoreTemplate = (measure, date) => {
  const id = Object.keys(measure).filter((key) => key.startsWith(measure.measurementType))[0];
  const data = JSON.parse(JSON.stringify(measure));
  data.timeStamp = date.toISOString();
  return { data, id };
};

const dateGenerator = (date, gap, compliance) => {
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
    if (randomOf100() < compliance) {
      numeratorDates.push(randomDay);
    }
  } else { // Multiple days.
    let previousDays = 0;
    let doctorInformed = randomOf100() < compliance;
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
        doctorInformed = randomOf100() < compliance;
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
  newSingleDate: (measure, date, compliance) => {
    const { data, id } = newScoreTemplate(measure, date);
    const { gap } = template[measure];
    const { initialPopDates, exclusionDates, numeratorDates } = dateGenerator(
      date, gap, compliance,
    );
    data[id] = {
      'Initial Population': initialPopDates,
      Exclusions: exclusionDates,
      Denominator: initialPopDates,
      Numerator: numeratorDates,
      id,
    };
    return data;
  },
  updateSingleDate: (measure, date) => { // Copy denominator to numerator
    const { data, id } = updateScoreTemplate(measure, date);
    data[id].Numerator = data[id].Denominator;
    return data;
  },
  newSingleBool: (measure, date, compliance) => { // Single boolean value, nothing interesting.
    const { data, id } = newScoreTemplate(measure, date);
    data[id] = {
      'Initial Population': true,
      Exclusions: randomBool(),
      Denominator: true,
      Numerator: randomOf100() < compliance,
      id,
    };
    return data;
  },
  updateSingleBool: (measure, date) => { // Can only flip numerator.
    const { data, id } = updateScoreTemplate(measure, date);
    data[id].Numerator = randomTruerBool();
    return data;
  },
  newDoubleBool: (measure, date, compliance) => { // Same init pop, differing denom and numerators.
    const { data, id } = newScoreTemplate(measure, date);
    const exclusion = randomBool();
    const numerator1 = randomOf100() < compliance;
    const denominator2 = randomBool();
    data[id] = {
      'Initial Population 1': true,
      'Initial Population 2': true,
      'Exclusions 1': exclusion,
      'Exclusions 2': exclusion,
      'Denominator 1': true,
      'Denominator 2': denominator2,
      'Numerator 1': numerator1,
      'Numerator 2': denominator2 && numerator1 ? randomOf100() < compliance : false,
      id,
    };
    return data;
  },
  updateDoubleBool: (measure, date) => { // Same init pop and denom, differing numerators.
    const { data, id } = updateScoreTemplate(measure, date);
    if (!data[id]['Numerator 1']) {
      data[id]['Numerator 1'] = randomTruerBool();
    }
    if (!data[id]['Denominator 2']) {
      data[id]['Denominator 2'] = randomTruerBool();
    }
    if (data[id]['Denominator 2'] && data[id]['Numerator 1'] && !data[id]['Numerator 2']) {
      data[id]['Numerator 2'] = randomTruerBool();
    }
    return data;
  }, // Same init pop and denom, 3rd num depends on prior 2
  newTripleDependBool: (measure, date, compliance) => {
    const { data, id } = newScoreTemplate(measure, date);
    const exclusion = randomBool();
    const numerator1 = randomOf100() < compliance;
    const numerator2 = randomOf100() < compliance;
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
  updateTripleDependBool: (measure, date) => {
    const { data, id } = updateScoreTemplate(measure, date);
    if (!data[id]['Numerator 1']) {
      data[id]['Numerator 1'] = randomTruerBool();
    }
    if (!data[id]['Numerator 2']) {
      data[id]['Numerator 2'] = randomTruerBool();
    }
    if (data[id]['Numerator 1'] && data[id]['Numerator 2']) {
      data[id]['Numerator 3'] = true;
    }
    return data;
  },
  newDoubleDeliveries: (measure, date) => {
    const { data, id } = newScoreTemplate(measure, date);
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
  updateDoubleDeliveries: (measure, date) => {
    const { data, id } = updateScoreTemplate(measure, date);
    if (data[id]['Denominator 2'].length !== data[id]['Denominator 1'].length > 0 && randomTruerBool()) {
      data[id]['Denominator 2'] = data[id]['Denominator 1'];
    }
    if (data[id]['Denominator 2'].length !== data[id]['Numerator 1'].length > 0 && randomTruerBool()) {
      data[id]['Numerator 1'] = data[id]['Denominator 2'];
    }
    if (data[id]['Numerator 2'].length !== data[id]['Numerator 1'].length > 0 && randomTruerBool()) {
      data[id]['Numerator 2'] = data[id]['Numerator 1'];
    }
    return data;
  },
  newADDE: (measure, date, compliance) => { // Differing initial populations
    const { data, id } = newScoreTemplate(measure, date);
    const exclusion = randomBool();
    const numerator1 = randomOf100() < compliance;
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
      'Numerator 2': denominator2 && numerator1 ? randomOf100() < compliance : false,
      id,
    };
    return data;
  },
  updateADDE: (measure, date) => {
    const { data, id } = updateScoreTemplate(measure, date);
    if (!data[id]['Initial Population 2']) {
      data[id]['Initial Population 2'] = randomTruerBool();
    }
    if (!data[id]['Denominator 2']) {
      data[id]['Denominator 2'] = randomTruerBool();
    }
    if (data[id]['Denominator 2'] && data[id]['Numerator 1'] && !data[id]['Numerator 2']) {
      data[id]['Numerator 2'] = randomTruerBool();
    }
    return data;
  },
  newAISE: (measure, date, compliance) => { // 4 sub measure, depending on vaccines and age ranges
    const { data, id } = newScoreTemplate(measure, date);
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
      'Numerator 1': randomOf100() < compliance,
      'Numerator 2': randomOf100() < compliance,
      'Numerator 3': initialPop3 ? randomOf100() < compliance : false,
      'Numerator 4': initialPop4 ? randomOf100() < compliance : false,
      id,
    };
    return data;
  },
  updateAISE: (measure, date) => {
    const { data, id } = updateScoreTemplate(measure, date);
    if (!data[id]['Numerator 1']) {
      data[id]['Numerator 1'] = randomTruerBool();
    }
    if (!data[id]['Numerator 2']) {
      data[id]['Numerator 2'] = randomTruerBool();
    }
    if (!data[id]['Initial Population 3']) {
      const updateValue = randomBool() && !randomTruerBool(); // 1/2 * 3/10 15% chance.
      data[id]['Initial Population 3'] = updateValue;
      data[id]['Denominator 3'] = updateValue;
    }
    if (!data[id]['Initial Population 4'] && data[id]['Initial Population 3']) {
      const updateValue = randomBool();
      data[id]['Initial Population 4'] = updateValue;
      data[id]['Denominator 4'] = updateValue;
    }
    if (data[id]['Initial Population 3'] && !data[id]['Numerator 3']) {
      data[id]['Numerator 3'] = randomBool();
    }
    if (data[id]['Initial Population 4'] && !data[id]['Numerator 4']) {
      data[id]['Numerator 4'] = randomBool();
    }
    return data;
  },
  newCISE: (measure, date, compliance) => { // 13 nums, have fun!
    const { data, id } = newScoreTemplate(measure, date);
    const exclusion = !randomTruerBool();
    data[id] = {};
    for (let i = 1; i < 14; i += 1) { // Not as performant but easier to read.
      data[id][`Initial Population ${i}`] = true;
    }
    for (let i = 1; i < 14; i += 1) {
      data[id][`Exclusions ${i}`] = exclusion;
    }
    for (let i = 1; i < 14; i += 1) {
      data[id][`Denominator ${i}`] = true;
    }
    for (let i = 1; i < 11; i += 1) {
      data[id][`Numerator ${i}`] = randomOf100() < compliance;
    }
    const numerator11 = numeratorCheck(data[id], 7);
    const numerator12 = numerator11 && data[id]['Numerator 8'] && data[id]['Numerator 9'];
    data[id]['Numerator 11'] = numerator11;
    data[id]['Numerator 12'] = numerator12;
    data[id]['Numerator 13'] = numerator12 && data[id]['Numerator 10'];
    return data;
  },
  updateCISE: (measure, date) => {
    const { data, id } = updateScoreTemplate(measure, date);
    for (let i = 1; i < 11; i += 1) {
      if (!data[id][`Numerator ${i}`]) {
        data[id][`Numerator ${i}`] = randomTruerBool();
      }
    }
    const numerator11 = numeratorCheck(data[id], 7);
    const numerator12 = numerator11 && data[id]['Numerator 8'] && data[id]['Numerator 9'];
    data[id]['Numerator 11'] = numerator11;
    data[id]['Numerator 12'] = numerator12;
    data[id]['Numerator 13'] = numerator12 && data[id]['Numerator 10'];
    return data;
  },
  newCOU: (measure, date, compliance) => { // Same init pop, differing denom and numerators.
    const { data, id } = newScoreTemplate(measure, date);
    const exclusion = randomBool();
    const numerator1 = randomOf100() < compliance;
    data[id] = {
      'Initial Population 1': true,
      'Initial Population 2': true,
      'Exclusions 1': exclusion,
      'Exclusions 2': exclusion,
      'Denominator 1': true,
      'Denominator 2': true,
      'Numerator 1': numerator1,
      'Numerator 2': numerator1 ? randomOf100() < compliance : false,
      id,
    };
    return data;
  },
  updateCOU: (measure, date) => {
    const { data, id } = updateScoreTemplate(measure, date);
    if (!data[id]['Numerator 1']) {
      data[id]['Numerator 1'] = randomTruerBool();
    }
    if (data[id]['Numerator 1'] && !data[id]['Numerator 2']) {
      data[id]['Numerator 2'] = randomTruerBool();
    }
    return data;
  },
  newDMSE: (measure, date, compliance) => { // Checks 3 times a year, then denom is always true
    const { data, id } = newScoreTemplate(measure, date);
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
      'Numerator 1': initialPop1 ? randomOf100() < compliance : false,
      'Numerator 2': initialPop2 ? randomOf100() < compliance : false,
      'Numerator 3': initialPop3 ? randomOf100() < compliance : false,
      id,
    };
    return data;
  },
  updateDMSE: (measure, date) => { // Checks 3 times a year, then denom is always true
    const { data, id } = updateScoreTemplate(measure, date);
    for (let i = 1; i < 3; i += 1) {
      if (!data[id][`Initial Population ${i}`]) {
        const updateValue = randomBool();
        data[id][`Initial Population ${i}`] = updateValue;
        data[id][`Denominator ${i}`] = updateValue;
      }
      if (data[id][`Initial Population ${i}`] && !data[id][`Numerator ${i}`]) {
        data[id][`Numerator ${i}`] = randomBool();
      }
    }
    if (data[id]['Initial Population 3'] && !data[id]['Numerator 3']) {
      data[id]['Numerator 3'] = randomBool();
    }
    return data;
  },
  newDRRE: (measure, date, compliance) => { // Checks 3 times a year, then denom is always true
    const { data, id } = newScoreTemplate(measure, date);
    const exclusion = !randomTruerBool();
    const numerator3 = randomOf100() < compliance; // Numerator 2 is dependent on 3.
    const numerator2 = numerator3 ? randomOf100() < compliance : false;
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
  updateDRRE: (measure, date) => { // Checks 3 times a year, then denom is always true
    const { data, id } = updateScoreTemplate(measure, date);
    if (!data[id]['Numerator 3']) {
      data[id]['Numerator 3'] = randomTruerBool();
    }
    if (data[id]['Numerator 3'] && !data[id]['Numerator 2']) {
      data[id]['Numerator 2'] = randomTruerBool();
    }
    return data;
  },
  newFUM: (measure, date, compliance) => { // One for 30 day gap, another for 7.
    const { data, id } = newScoreTemplate(measure, date);
    const { gap } = template[measure];
    const { initialPopDates, exclusionDates, numeratorDates } = dateGenerator(
      date, gap, compliance,
    );
    const numerator2Dates = Array.from(numeratorDates);
    if (!randomTruerBool()) {
      numerator2Dates.splice(Math.floor(Math.random(numeratorDates.length) * numeratorDates), 1);
    }
    data[id] = {
      'Initial Population 1': initialPopDates,
      'Initial Population 2': initialPopDates,
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
  updateFUM: (measure, date) => { // One for 30 day gap, another for 7.
    const { data, id } = updateScoreTemplate(measure, date);
    if (data[id]['Numerator 1'].length !== data[id]['Denominator 1'].length && !randomTruerBool()) {
      data[id]['Numerator 1'] = data[id]['Denominator 1'];
    }
    if (data[id]['Numerator 2'].length !== data[id]['Denominator 2'].length && !randomTruestBool() && !randomTruestBool()) {
      data[id]['Numerator 2'] = data[id]['Denominator 2'];
    }
    return data;
  },
  newIMAE: (measure, date, compliance) => { // 4 is based on 1, 2, and 5 on 1, 2, 3
    const { data, id } = newScoreTemplate(measure, date);
    const exclusion = !randomTruerBool();
    data[id] = {};
    for (let i = 1; i < 6; i += 1) { // Not as performant but easier to read.
      data[id][`Initial Population ${i}`] = true;
    }
    for (let i = 1; i < 6; i += 1) {
      data[id][`Exclusions ${i}`] = exclusion;
    }
    for (let i = 1; i < 6; i += 1) {
      data[id][`Denominator ${i}`] = true;
    }
    for (let i = 1; i < 4; i += 1) {
      data[id][`Numerator ${i}`] = randomOf100() < compliance;
    }
    const numerator4 = data[id]['Numerator 1'] && data[id]['Numerator 2'];
    data[id]['Numerator 4'] = numerator4;
    data[id]['Numerator 5'] = numerator4 && data[id]['Numerator 3'];
    data[id].id = id;
    return data;
  },
  updateIMAE: (measure, date) => { // 4 is based on 1, 2, and 5 on 1, 2, 3
    const { data, id } = updateScoreTemplate(measure, date);
    for (let i = 1; i < 4; i += 1) {
      if (!data[id][`Numerator ${i}`]) {
        data[id][`Numerator ${i}`] = randomBool();
      }
    }
    const numerator4 = data[id]['Numerator 1'] && data[id]['Numerator 2'];
    data[id]['Numerator 4'] = numerator4;
    data[id]['Numerator 5'] = numerator4 && data[id]['Numerator 3'];
    return data;
  },
  newPRSE: (measure, date, compliance) => {
    const { data, id } = newScoreTemplate(measure, date);
    const initialPop1 = [deliveryGenerator()];
    const exclusion = randomBool() ? initialPop1 : [];
    const numerator1 = randomOf100() < compliance ? initialPop1 : [];
    const numerator2 = randomOf100() < compliance ? initialPop1 : [];
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
  updatePRSE: (measure, date) => {
    const { data, id } = updateScoreTemplate(measure, date);
    for (let i = 1; i < 3; i += 1) {
      if (data[id][`Numerator ${i}`].length !== data[id][`Denominator ${i}`].length && !randomTruestBool() && !randomTruestBool()) {
        data[id][`Numerator ${i}`] = data[id][`Denominator ${i}`];
      }
    }
    return data;
  },
};

const scoresToUpdate = [];
let finalNoncompliant = 0;
let scoresUpdated = 0;

function isCompliant(score) {
  const measure = score.measurementType;
  const id = Object.keys(score).filter((key) => key.startsWith(measure))[0];
  if (id === undefined) { // Man, something went wrong here... skip it.
    return true;
  }

  if (template[measure].type === 'bool') {
    if (template[measure].subs === 1 && !score[id].Numerator) {
      return false;
    }
    for (let i = 1; i < template[measure].subs; i += 1) {
      if (!score[id][`Numerator ${i}`]) {
        return false;
      }
    }
  }
  if (template[measure].subs === 1
     && score[id].Numerator.length !== score[id].Denominator.length) {
    return false;
  }
  for (let i = 1; i < template[measure].subs; i += 1) {
    if (score[id][`Numerator ${i}`].length !== score[id][`Denominator ${i}`].length) {
      return false;
    }
  }
  return true;
}

async function generateData(measureList, days) {
  let currentDay = new Date(new Date().setDate(today.getDate() - days));
  console.log('\n\x1b[33mInfo:\x1b[0m Starting data generation with settings:');
  console.log(`\x1b[33mInfo:\x1b[0m Measures will be produced for ${measureList.toString()} will be used.\n`);
  const newScores = [];
  let measure;
  const dayTracker = {}; // Manages how many records are created and when rates changes.

  let daysLeft = days;
  while (daysLeft > 0) {
    currentDay = new Date(new Date().setDate(today.getDate() - daysLeft));
    console.log(`TESTING: On day ${daysLeft}, ${currentDay.toISOString()}:`);
    for (let i = 0; i < scoresToUpdate.length; i += 1) {
      const score = measureFunctions[template[scoresToUpdate[i].measurementType]
        .updateEntry](scoresToUpdate[i], currentDay);
      newScores.push(score);
      if (!isCompliant(score)) {
        if (randomOf100() < template[scoresToUpdate[i].measurementType].updateChance) {
          scoresToUpdate.push(score);
          scoresUpdated += 1;
        } else {
          finalNoncompliant += 1;
        }
      }
      scoresToUpdate.splice(i, 1);
    }

    console.log(`TESTING: Compliance update: ${scoresToUpdate.length} non-compliant, ${scoresUpdated} now compliant, ${finalNoncompliant} will never be.`);
    console.log(`TESTING: Running total: ${newScores.length}.`);
    for (let i = 0; i < measureList.length; i += 1) {
      measure = measureList[i % measureList.length];
      if (dayTracker[measure] === undefined) {
        dayTracker[measure] = {};
      }

      // Checks for rate updates.
      if (dayTracker[measure].nextDay === undefined) {
        dayTracker[measure].complyRange = template[measure].ranges[0].compRange;
        dayTracker[measure].popRange = template[measure].ranges[0].popRange;
        dayTracker[measure].nextDay = template[measure].ranges.find(
          (templateRange) => templateRange.day > 0,
        )?.day || 0;
      } else if (dayTracker[measure].nextDay > 0
        && days - daysLeft >= dayTracker[measure].nextDay) {
        const compareDay = dayTracker[measure].nextDay;
        const rangeIndex = template[measure].ranges.findIndex(
          (newRange) => newRange.day === compareDay,
        );
        dayTracker[measure].complyRange = template[measure].ranges[rangeIndex].compRange;
        dayTracker[measure].popRange = template[measure].ranges[rangeIndex].popRange;
        dayTracker[measure].nextDay = (rangeIndex < template[measure].ranges.length - 1)
          ? template[measure].ranges[rangeIndex + 1].day : 0;
      }

      // Generates today's compliance rates and population.
      dayTracker[measure].complyRate = Math.floor(Math.random() * (
        dayTracker[measure].complyRange[1] - dayTracker[measure].complyRange[0]))
        + dayTracker[measure].complyRange[0];
      dayTracker[measure].amount = Math.floor(
        Math.random() * (dayTracker[measure].popRange[1] - dayTracker[measure].popRange[0] + 1),
      ) + dayTracker[measure].popRange[0];
    }
    console.log(JSON.stringify(dayTracker));

    for (let i = 0; i < measureList.length; i += 1) {
      measure = measureList[i % measureList.length];
      for (let j = 0; j < dayTracker[measure].amount; j += 1) {
        const score = measureFunctions[template[measure].newEntry](
          measure, currentDay, dayTracker[measure].complyRate,
        );
        newScores.push(score);
        if (!isCompliant(score)) {
          if (randomOf100() < template[measure].updateChance) {
            scoresToUpdate.push(score);
          } else {
            finalNoncompliant += 1;
          }
        }
      }
    }
    console.log(`TESTING: Day ${daysLeft} final report: ${newScores.length} total records, ${scoresToUpdate.length} non-compliant.\n`);
    daysLeft -= 1;
  }
  return newScores;
}

function outputData(newScoresList, measureList, days) {
  let fileTitle = `data_measures-${measureList.toString().replace(/,/g, '-')}_days-${days}`;
  fileTitle += `_${dateFormatter(today)}_${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}.json`;

  try {
    fs.writeFileSync(`${__dirname}/test/generated-data/${fileTitle}`, JSON.stringify(newScoresList, null, 4));
  } catch (writeErr) {
    console.error(`\x1b[31mError:\x1b[0m Unable to write to directory:${writeErr}.`);
    process.exit();
  }
  console.log(`\x1b[32mSuccess:\x1b[0m Check ${fileTitle} for new data.`);
  process.exit();
}

async function insertData(newScoresList) {
  await dao.init();
  const insertResults = await dao.insertMembers(newScoresList);
  if (!insertResults) {
    console.error('\x1b[31mError:\x1b[0m Something went wrong during insertion.');
    process.exit();
  }
  const waitTime = 1000 + newScoresList.length * 3;
  console.log(`\x1b[33mInfo:\x1b[0m Results are being inserted into DAO. Please wait ${waitTime} seconds for asynchronous completion...`);
  setTimeout(() => {
    console.log('\x1b[32mSuccess:\x1b[0m Check database for new insertions.');
    process.exit();
  }, waitTime);
}

async function processData() {
  let measureList = Object.keys(template);
  if (parseArgs.i !== undefined) {
    const includedList = parseArgs.i.split(',');
    const checkedList = includedList.filter((measure) => !measureList.includes(measure));
    if (checkedList.length > 0) {
      console.error(`\x1b[31mError:\x1b[0m Unknown measures: ${checkedList}. Aborting.`);
      process.exit();
    }
    measureList = includedList;
  }

  if (parseArgs.d && typeof parseArgs.d !== 'number') {
    console.error('\x1b[31mError:\x1b[0m The "days" argument must be a number. Aborting.');
    process.exit();
  }

  if (parseArgs.s && typeof parseArgs.s !== 'number') {
    console.error('\x1b[31mError:\x1b[0m The "size" argument must be a number. Aborting.');
    process.exit();
  }

  const days = parseArgs.d || 0;
  const newScoresList = await generateData(measureList, days);
  console.log(`\x1b[33mInfo:\x1b[0m ${newScoresList.length} scores to be inserted. ${scoresToUpdate.length} are non-compliant, and ${scoresUpdated} became compliant.`);
  if (parseArgs.o) {
    outputData(newScoresList, measureList, days);
  }
  insertData(newScoresList);
}

if (parseArgs.h === true) {
  console.log('\n A script for generated fake HEDIS scores for Saraswati.\n\n Options:');
  console.log('   -d, --days: How many days back you want generated. Default is 0, today.');
  console.log('   -h, --help: Help command. What you\'re reading now...');
  console.log('   -i, --include: A spaceless, comma-separated list of measures to create. Default is to use all. Valid options are: ');
  console.log(`\t${Object.keys(template).join(', ')}`);
  console.log('   -o, --output: Instead of inserting into database, writes output to the file "saraswati-test-data" with a datetime stamp.');
  process.exit();
}

processData();
