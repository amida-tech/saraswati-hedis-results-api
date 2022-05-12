/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const { v4: uuidv4 } = require('uuid');
const minimist = require('minimist');
const fs = require('fs');
const dao = require('./src/config/dao');

const parseArgs = minimist(process.argv.slice(2), {
  alias: {
    d: 'days',
    h: 'help',
    i: 'include',
    r: 'range',
    s: 'size',
    o: 'output',
  },
});

const template = {
  aab: { // Avoidance of Antibiotic Treatment for Acute Bronchitis/Bronchiolitis
    subs: 1, type: 'date', gap: 31, newEntry: 'newSingleDate', updateEntry: 'updateSingleDate',
  },
  adde: { // Follow-Up Care for Children Prescribed ADHD Medication
    subs: 2, type: 'bool', newEntry: 'newADDE', updateEntry: 'updateADDE',
  },
  aise: { // Adult Immunization Status
    subs: 4, type: 'bool', newEntry: 'newAISE', updateEntry: 'updateAISE',
  },
  apme: { // Metabolic Monitoring for Children and Adolescents on Antipsychotics
    subs: 3, type: 'bool', newEntry: 'newTripleDependBool', updateEntry: 'updateTripleDependBool',
  },
  asfe: { // Unhealthy Alcohol Use Screening and Follow-Up
    subs: 2, type: 'bool', newEntry: 'newDoubleBool', updateEntry: 'updateDoubleBool',
  },
  bcse: { // Breast Cancer Screening
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  ccs: { // Cervical Cancer Screening
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  cise: { // Childhood Immunization Status
    subs: 13, type: 'bool', newEntry: 'newCISE', updateEntry: 'updateCISE',
  },
  cole: { // Colorectal Cancer Screening
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  cou: { // Risk of Continued Opioid Use
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  cwp: { // Appropriate Testing for Pharyngitis
    subs: 1, type: 'date', gap: 31, newEntry: 'newSingleDate', updateEntry: 'updateSingleDate',
  },
  dmse: { // Utilization of the PHQ-9 to Monitor Depression Symptoms for Adolescents and Adults
    subs: 3, type: 'bool', newEntry: 'newDMSE', updateEntry: 'updateDMSE',
  },
  drre: { // Depression Remission or Response for Adolescents and Adults
    subs: 3, type: 'bool', newEntry: 'newDRRE', updateEntry: 'updateDRRE',
  },
  dsfe: { // Depression Screening and Follow-Up for Adolescents and Adults
    subs: 2, type: 'bool', newEntry: 'newDoubleBool', updateEntry: 'updateDoubleBool',
  },
  fum: { // Follow-Up After Emergency Department Visit for Mental Illness
    subs: 2, type: 'date', gap: 31, newEntry: 'newFUM', updateEntry: 'updateFUM',
  },
  imae: { // Immunizations for Adolescents
    subs: 5, type: 'bool', newEntry: 'newIMAE', updateEntry: 'updateIMAE',
  },
  pdse: { // Postpartum Depression Screening and Follow-Up
    subs: 2, type: 'object', newEntry: 'newDoubleDeliveries', updateEntry: 'updateDoubleDeliveries',
  },
  pnde: { // Prenatal Depression Screening and Follow-Up
    subs: 2, type: 'object', newEntry: 'newDoubleDeliveries', updateEntry: 'updateDoubleDeliveries',
  },
  prse: { // Prenatal Immunization Status
    subs: 3, type: 'object', newEntry: 'newPRSE', updateEntry: 'updatePRSE',
  },
  psa: { // Non-Recommended PSA-Based (prostate-specific antigen) Screening in Older Men
    subs: 1, type: 'bool', newEntry: 'newSingleBool', updateEntry: 'updateSingleBool',
  },
  uop: { // Use of Opioids From Multiple Providers
    subs: 3, type: 'bool', newEntry: 'newTripleDependBool', updateEntry: 'updateTripleDependBool',
  },
  uri: { // Appropriate Treatment for Upper Respiratory Infection
    subs: 1, type: 'date', gap: 31, newEntry: 'newSingleDate', updateEntry: 'updateSingleDate',
  },
};

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

const coveragePlans = [
  { code: 'MCPOL', display: 'Managed Care Policy' },
  { code: 'HMO', display: 'Health Maintenance Organization Policy' },
  { code: 'PPO', display: 'Preferred Provider Organization Policy' },
];

const providerOptions = [
  {
    measures: ['aab', 'adde', 'aise', 'apme', 'asfe', 'bcse', 'ccs', 'cise', 'cole', 'cou',
      'cwp', 'dmse', 'drre', 'dsfe', 'fum', 'imae', 'pdse', 'pnde', 'prse', 'psa', 'uop', 'uri'],
    providers: [{
      reference: 'Organization?identifier=71533123',
      display: 'Norton Hill Carecenter',
    }, {
      reference: 'Practitioner?identifier=1143',
      display: 'Doctor Anne Guish',
    }, {
      reference: 'Practitioner?identifier=1221',
      display: 'Nurse Karen Patches',
    }],
  },
  {
    measures: ['aab', 'adde', 'aise', 'apme', 'asfe', 'cise', 'cwp', 'dmse', 'drre',
      'dsfe', 'fum', 'pdse', 'pnde', 'prse'],
    providers: [{
      reference: 'Organization?identifier=71533123',
      display: 'Springfield Hospital',
    }, {
      reference: 'Practitioner?identifier=1143',
      display: 'Dr. Marc Weber, General Practitioner',
    }],
  },
  {
    measures: ['aab', 'aise', 'cise', 'cou', 'imae', 'uop', 'uri'],
    providers: [{
      reference: 'Organization?identifier=667531',
      display: 'Hollifield Clinics',
    }, {
      reference: 'Practitioner?identifier=7882499',
      display: 'Nurse Practitioner Sharon Arthurs',
    }],
  },
  {
    measures: ['bcse', 'ccs', 'cole', 'psa'],
    providers: [{
      reference: 'Organization?identifier=8554',
      display: 'Cancer Treatment & Care',
    }, {
      reference: 'Practitioner?identifier=903321',
      display: 'Dr. Larry McDaniels',
    }],
  },
  {
    measures: ['prse', 'pnde', 'pdse'],
    providers: [{
      reference: 'Organization?identifier=9911',
      display: "Anova Women's Birthing Service",
    }, {
      reference: 'Practitioner?identifier=8123',
      display: 'Dr. Colette DeBarge',
    }],
  },
];

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
    const { data, id } = newScoreTemplate(measure, date);
    const { gap } = template[measure];
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
  updateSingleDate: (measure, date) => { // Copy denominator to numerator
    const { data, id } = updateScoreTemplate(measure, date);
    if (randomTruerBool()) {
      data[id].Numerator = data[id].Denominator;
    }
    return data;
  },
  newSingleBool: (measure, date) => { // Single boolean value, nothing interesting.
    const { data, id } = newScoreTemplate(measure, date);
    data[id] = {
      'Initial Population': true,
      Exclusions: randomBool(),
      Denominator: true,
      Numerator: randomBool(),
      id,
    };
    return data;
  },
  updateSingleBool: (measure, date) => { // Can only flip numerator.
    const { data, id } = updateScoreTemplate(measure, date);
    data[id].Numerator = randomTruerBool();
    return data;
  },
  newDoubleBool: (measure, date) => { // Same init pop, differing denom and numerators.
    const { data, id } = newScoreTemplate(measure, date);
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
  },
  newTripleDependBool: (measure, date) => { // Same init pop and denom, 3rd num depends on prior 2
    const { data, id } = newScoreTemplate(measure, date);
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
  newADDE: (measure, date) => { // Differing initial populations
    const { data, id } = newScoreTemplate(measure, date);
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
  newAISE: (measure, date) => { // 4 sub measure, depending on vaccines and age ranges
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
      'Numerator 1': randomBool(),
      'Numerator 2': randomBool(),
      'Numerator 3': initialPop3 ? randomBool() : false,
      'Numerator 4': initialPop4 ? randomBool() : false,
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
  newCISE: (measure, date) => { // 13 nums, have fun!
    const { data, id } = newScoreTemplate(measure, date);
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
  newDMSE: (measure, date) => { // Checks 3 times a year, then denom is always true
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
      'Numerator 1': initialPop1 ? randomTruerBool() : false,
      'Numerator 2': initialPop2 ? randomTruerBool() : false,
      'Numerator 3': initialPop3 ? randomTruerBool() : false,
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
  newDRRE: (measure, date) => { // Checks 3 times a year, then denom is always true
    const { data, id } = newScoreTemplate(measure, date);
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
  updateDRRE: (measure, date) => { // Checks 3 times a year, then denom is always true
    const { data, id } = updateScoreTemplate(measure, date);
    if (!data[id]['Numerator 3']) {
      data[id]['Numerator 3'] = randomBool();
    }
    if (data[id]['Numerator 3'] && !data[id]['Numerator 2']) {
      data[id]['Numerator 2'] = randomBool();
    }
    return data;
  },
  newFUM: (measure, date) => { // One for 30 day gap, another for 7.
    const { data, id } = newScoreTemplate(measure, date);
    const { gap } = template[measure];
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
  newIMAE: (measure, date) => { // 4 is based on 1, 2, and 5 on 1, 2, 3
    const { data, id } = newScoreTemplate(measure, date);
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
  newPRSE: (measure, date) => {
    const { data, id } = newScoreTemplate(measure, date);
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
let scoresUpdated = 0;

function saveCompliance(score) {
  const measure = score.measurementType;
  const id = Object.keys(score).filter((key) => key.startsWith(measure))[0];
  if (id === undefined) { // Man, something went wrong here... skip it.
    return;
  }

  if (template[measure].type === 'bool') {
    if (template[measure].subs === 1 && !score[id].Numerator) {
      scoresToUpdate.push(score);
      return;
    }
    for (let i = 1; i < template[measure].subs; i += 1) {
      if (!score[id][`Numerator ${i}`]) {
        scoresToUpdate.push(score);
        return; // We know it's not compliant.
      }
    }
  }
  if (template[measure].subs === 1
     && score[id].Numerator.length !== score[id].Denominator.length) {
    scoresToUpdate.push(score);
    return;
  }
  for (let i = 1; i < template[measure].subs; i += 1) {
    if (score[id][`Numerator ${i}`].length !== score[id][`Denominator ${i}`].length) {
      scoresToUpdate.push(score);
      return;
    }
  }
}

async function generateData(measureList, scoreAmount, days, range) {
  let currentDay = new Date(new Date().setDate(today.getDate() - days));
  console.log('\n\x1b[33mInfo:\x1b[0m Starting data generation with settings:');
  console.log(`\x1b[33mInfo:\x1b[0m ${scoreAmount} scores for the first day of ${currentDay.toDateString()}.`);
  console.log(`\x1b[33mInfo:\x1b[0m After that, every day produces between ${range[0]} and ${range[1]} new scores.`);
  console.log(`\x1b[33mInfo:\x1b[0m Measures will be produced for ${measureList.toString()} will be used.\n`);
  const newScores = [];
  let measure;
  for (let i = 0; i < scoreAmount; i += 1) {
    measure = measureList[i % measureList.length];
    const score = measureFunctions[template[measure].newEntry](measure, currentDay);
    newScores.push(score);
    saveCompliance(score);
  }
  console.log(`TESTING: Start at day ${days}:`);
  console.log(`TESTING: ${scoreAmount} records generated, ${scoresToUpdate.length} are non-compliant.\n`);
  let daysLeft = days - 1;
  while (daysLeft > 0) {
    currentDay = new Date(new Date().setDate(today.getDate() - daysLeft));
    for (let i = 0; i < scoresToUpdate.length; i += 1) {
      if (!randomTruerBool()) {
        const score = measureFunctions[template[scoresToUpdate[i].measurementType]
          .updateEntry](scoresToUpdate[i], currentDay);
        newScores.push(score);
        saveCompliance(score); // Resaves measure whether it really changed or not.
        scoresToUpdate.splice(i, 1);
        scoresUpdated += 1;
      }
    }
    console.log(`TESTING: Day ${daysLeft}:`);
    console.log(`TESTING: Compliance update: ${scoresToUpdate.length} non-compliant, ${scoresUpdated} now compliant.`);
    console.log(`TESTING: Running total: ${newScores.length}.`);
    const rangeSelected = Math.floor(Math.random() * (range[1] - range[0])) + range[0];
    console.log(`TESTING: Generating ${rangeSelected} new records, compliance unknown.`);
    for (let i = 0; i < rangeSelected; i += 1) {
      measure = measureList[i % measureList.length];
      const score = measureFunctions[template[measure].newEntry](measure, currentDay);
      newScores.push(score);
      saveCompliance(score);
    }
    console.log(`TESTING: Day ${daysLeft} final report:`);
    console.log(`${newScores.length} total records. ${scoresToUpdate.length} non-compliant.\n`);
    daysLeft -= 1;
  }
  return newScores;
}

function outputData(newScoresList) {
  let fileTitle = `saraswati-test-data_${dateFormatter(today)}`;
  fileTitle += `_${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}.json`;

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
  const insertResults = await dao.insertMeasures(newScoresList);
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

async function processData() {
  let measureList = Object.keys(template);
  if (parseArgs.i) {
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

  let range = [100, 200];
  if (parseArgs.r) {
    range = parseArgs.r.split(',').map((entry) => parseInt(entry, 10)).sort();
    if (range.length !== 2 || Number.isNaN(range[0]) || Number.isNaN(range[1])) {
      console.error(`\x1b[31mError:\x1b[0m You must provide two numbers for "range" argument. You provided "${range}". Aborting.`);
      process.exit();
    }
  }

  const scoreAmount = parseArgs.s || 300;
  const days = parseArgs.d || 0;
  const newScoresList = await generateData(measureList, scoreAmount, days, range);
  console.log(`\x1b[33mInfo:\x1b[0m ${newScoresList.length} scores to be inserted. ${scoresToUpdate.length} are non-compliant, and ${scoresUpdated} became compliant.`);
  if (parseArgs.o) {
    outputData(newScoresList);
  }
  insertData(newScoresList);
}

if (parseArgs.h === true) {
  console.log('\n A script for generated fake HEDIS scores for Saraswati.\n\n Options:');
  console.log('   -d, --days: How many days back you want generated. Default is 0, today.');
  console.log('   -h, --help: Help command. What you\'re reading now...');
  console.log('   -i, --include: A spaceless, comma-separated list of measures to create. Default is to use all. Valid options are: ');
  console.log(`\t${Object.keys(template).join(', ')}`);
  console.log('   -r, --range: A comma-separated list of two numbers, for the amount produced after the first day. Defaults are 100 to 200.');
  console.log('   -s, --size: The number of produced HEDIS measurement scores. Default is 300.');
  console.log('   -o, --output: Instead of inserting into database, writes output to the file "saraswati-test-data" with a datetime stamp.');
  process.exit();
}

processData();
