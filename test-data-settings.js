// const usZipCodes = ['10001', '90210', '60601', '33139',
//   '02108', '98101', '75201', '30301',
//   '80202', '19019', '85001', '70112',
//   '55401', '97201', '63101', '48201',
//   '20001', '89101', '37201', '96801',
// ];

const southCarolinaZipCodes = ['29401', '29550', '29601', '29108',
  '29730', '29501', '29902', '29526',
  '29650', '29201', '29577', '29801',
  '29690', '29016', '29445', '29588',
  '29634', '29078', '29325', '29582',
];

// const northCarolinaZipCodes = ['27401', '27403', '27405', '27407',
//   '27513', '27514', '27519', '27560',
//   '27587', '27601', '27603', '27608',
//   '27610', '28202', '28204', '28208',
//   '28210', '28215', '28262', '28277',
// ];

const raceCodes = ['1002-5', '2028-9', '2054-5', '2076-8', '2106-3', '2131-1'];

const ethnicityCodes = ['2135-2', '2186-5'];

const givenMaleNames = ['James', 'Muhammad', 'Wei', 'Jose', 'Raj', 'Ahmed', 'David', 'Carlos',
  'Hiroshi', 'Andre', 'Miguel', 'Dmitri', 'Giovanni', 'Kwame', 'Ali', 'Chen', 'Luis', 'Sven', 'Jamal',
  'Pablo', 'Yuki', 'Hassan', 'Liam', 'Mateo', 'Arjun', 'Ibrahim', 'Nguyen', 'Pierre', 'Kofi', 'Antonio',
  'Kenji', 'Omar', 'Stefan', 'Rafael', 'Amit', 'Tunde', 'Jin', 'Gabriel', 'Klaus', 'Rashid', 'Diego', 'Mikhail',
  'Chinonso', 'Youssef', 'Ethan', 'Javier', 'Takeshi', 'Amir', 'Marco', 'Tariq'];

const givenFemaleNames = ['Maria', 'Fatima', 'Ling', 'Sofia', 'Priya', 'Aisha', 'Emma', 'Carmen', 'Yuki',
  'Gabrielle', 'Lucia', 'Natasha', 'Isabella', 'Amara', 'Layla', 'Mei', 'Ana', 'Ingrid', 'Aaliyah', 'Valentina',
  'Sakura', 'Zara', 'Olivia', 'Camila', 'Ananya', 'Nour', 'Linh', 'Amelie', 'Ama', 'Rosa', 'Keiko', 'Yasmin',
  'Elena', 'Daniela', 'Kavya', 'Chioma', 'Jing', 'Isabelle', 'Greta', 'Mariam', 'Alejandra', 'Svetlana',
  'Ngozi', 'Salma', 'Ava', 'Adriana', 'Haruka', 'Nadia', 'Francesca', 'Amira'];

const surnames = ['Smith', 'Garcia', 'Wang', 'Singh', 'Sato', 'Kim', 'Silva', 'Nguyen',
  'Ivanov', 'Ali', 'Chen', 'Kumar', 'Lopez', 'Andersson', 'Rossi', 'Kowalski', 'O\'Brien', 'Dubois', 'Patel',
  'Martinez', 'Yamamoto', 'Hassan', 'Liu', 'Sharma', 'Novak', 'Popescu', 'Fernandez', 'Schmidt', 'Brown', 'Tanaka',
  'Ahmed', 'Zhang', 'Gupta', 'Rodriguez', 'Johansson', 'Bianchi', 'Nowak', 'Murphy', 'Moreau', 'Desai', 'Hernandez',
  'Fischer', 'Johnson', 'Suzuki', 'Khan', 'Li', 'Reddy', 'Gonzalez', 'Larsson', 'Romano', 'Lewandowski', 'Kelly',
  'Bernard', 'Mehta', 'Perez', 'Weber', 'Williams', 'Kobayashi', 'Abdullah', 'Wu', 'Rao', 'Sanchez', 'Nilsson',
  'Ferrari', 'Wojcik', 'Ryan', 'Leroy', 'Shah', 'Ramirez', 'Becker', 'Davis', 'Ito', 'Ibrahim', 'Huang', 'Joshi',
  'Torres', 'Eriksson', 'Ricci', 'Kowalczyk', 'O\'Connor', 'Martin', 'Kapoor', 'Cruz', 'Hoffmann', 'Wilson',
  'Takahashi', 'Mahmoud', 'Zhao', 'Nair', 'Flores', 'Olsson', 'Colombo', 'Kaminski', 'Byrne', 'Petit'];

const template = {
  aab: { // Avoidance of Antibiotic Treatment for Acute Bronchitis/Bronchiolitis
    subs: 1,
    measurementYears: [2022],
    type: 'date',
    ranges: [
      { day: 0, popRange: [3, 5], compRange: [60, 80] },
      { day: 18, popRange: [7, 8], compRange: [10, 15] },
      { day: 49, popRange: [15, 18], compRange: [70, 95] },
      { day: 55, popRange: [5, 15], compRange: [15, 25] },
      { day: 61, popRange: [12, 17], compRange: [5, 10] },
      { day: 158, popRange: [46, 57], compRange: [90, 95] },
    ],
    updateChance: 15,
    gap: 31,
    newEntry: 'newSingleDate',
    updateEntry: 'updateSingleDate',
  },
  adde: { // Follow-Up Care for Children Prescribed ADHD Medication
    subs: 2,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [5, 8], compRange: [10, 80] },
      { day: 30, popRange: [0, 0], compRange: [10, 100] },
      { day: 67, popRange: [15, 18], compRange: [50, 75] },
      { day: 116, popRange: [5, 15], compRange: [85, 95] },
      { day: 152, popRange: [90, 100], compRange: [5, 10] },
    ],
    updateChance: 25,
    newEntry: 'newADDE',
    updateEntry: 'updateADDE',
  },
  aise_2022: { // MY2022 Adult Immunization Status
    subs: 4,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [20, 30], compRange: [10, 20] },
      { day: 67, popRange: [5, 13], compRange: [80, 90] },
      { day: 79, popRange: [35, 53], compRange: [20, 25] },
      { day: 158, popRange: [115, 130], compRange: [90, 98] },
      { day: 164, popRange: [255, 280], compRange: [5, 7] },
      { day: 200, popRange: [15, 23], compRange: [40, 50] },
      { day: 228, popRange: [15, 23], compRange: [30, 40] },
      { day: 290, popRange: [15, 23], compRange: [80, 85] },
      { day: 320, popRange: [15, 23], compRange: [30, 90] },
    ],
    updateChance: 90,
    newEntry: 'newAISE',
    updateEntry: 'updateAISE',
  },
  aise_2025: { // MY2025 Adult Immunization Status
    subs: 5,
    measurementYears: [2025],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [20, 30], compRange: [10, 20] },
      { day: 67, popRange: [5, 13], compRange: [80, 90] },
      { day: 79, popRange: [35, 53], compRange: [20, 25] },
      { day: 158, popRange: [115, 130], compRange: [90, 98] },
      { day: 164, popRange: [255, 280], compRange: [5, 7] },
    ],
    updateChance: 90,
    newEntry: 'newAISE_2025',
    updateEntry: 'updateAISE_2025',
  },
  apme: { // Metabolic Monitoring for Children and Adolescents on Antipsychotics
    subs: 3,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [20, 30], compRange: [70, 80] },
      { day: 37, popRange: [5, 13], compRange: [10, 50] },
      { day: 201, popRange: [35, 53], compRange: [70, 85] },
      { day: 213, popRange: [15, 20], compRange: [10, 28] },
      { day: 304, popRange: [55, 70], compRange: [2, 4] },
    ],
    updateChance: 40,
    newEntry: 'newTripleDependBool',
    updateEntry: 'updateTripleDependBool',
  },
  asfe: { // Unhealthy Alcohol Use Screening and Follow-Up
    subs: 2,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [20, 30], compRange: [30, 70] },
      { day: 85, popRange: [5, 13], compRange: [10, 20] },
      { day: 140, popRange: [5, 8], compRange: [5, 95] },
      { day: 158, popRange: [15, 20], compRange: [10, 28] },
      { day: 249, popRange: [85, 120], compRange: [70, 88] },
      { day: 334, popRange: [15, 50], compRange: [12, 14] },
    ],
    updateChance: 55,
    newEntry: 'newDoubleBool',
    updateEntry: 'updateDoubleBool',
  },
  bcse: { // Breast Cancer Screening
    subs: 1,
    measurementYears: [2022, 2025],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [3, 6], compRange: [5, 10] },
      { day: 45, popRange: [10, 20], compRange: [50, 70] },
      { day: 90, popRange: [10, 20], compRange: [40, 50] },
      { day: 120, popRange: [20, 40], compRange: [90, 95] },
      { day: 225, popRange: [5, 8], compRange: [30, 65] },
      { day: 265, popRange: [8, 12], compRange: [50, 65] },
      { day: 300, popRange: [10, 15], compRange: [20, 35] },
    ],
    updateChance: 75,
    newEntry: 'newSingleBool',
    updateEntry: 'updateSingleBool',
  },
  ccs: { // Cervical Cancer Screening
    subs: 1,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [10, 15], compRange: [90, 95] },
      { day: 5, popRange: [3, 6], compRange: [10, 15] },
      { day: 37, popRange: [5, 8], compRange: [20, 45] },
    ],
    updateChance: 5,
    newEntry: 'newSingleBool',
    updateEntry: 'updateSingleBool',
  },
  cise: { // Childhood Immunization Status
    subs: 13,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [12, 24], compRange: [30, 45] },
      { day: 30, popRange: [3, 6], compRange: [20, 25] },
      { day: 91, popRange: [23, 36], compRange: [20, 100] },
      { day: 97, popRange: [3, 6], compRange: [20, 25] },
      { day: 274, popRange: [5, 8], compRange: [50, 65] },
    ],
    updateChance: 35,
    newEntry: 'newCISE',
    updateEntry: 'updateCISE',
  },
  cole: { // Colorectal Cancer Screening
    subs: 1,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [3, 6], compRange: [5, 10] },
      { day: 116, popRange: [10, 15], compRange: [60, 75] },
      { day: 225, popRange: [5, 8], compRange: [30, 65] },
    ],
    updateChance: 35,
    newEntry: 'newSingleBool',
    updateEntry: 'updateSingleBool',
  },
  cou: { // Risk of Continued Opioid Use
    subs: 2,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [20, 30], compRange: [70, 90] },
      { day: 18, popRange: [5, 13], compRange: [10, 35] },
      { day: 79, popRange: [55, 120], compRange: [80, 95] },
      { day: 85, popRange: [15, 20], compRange: [14, 28] },
      { day: 280, popRange: [20, 30], compRange: [10, 90] },
    ],
    updateChance: 10,
    newEntry: 'newCOU',
    updateEntry: 'updateCOU',
  },
  cwp: { // Appropriate Testing for Pharyngitis
    subs: 1,
    measurementYears: [2022],
    type: 'date',
    ranges: [
      { day: 0, popRange: [5, 8], compRange: [5, 7] },
      { day: 61, popRange: [5, 13], compRange: [40, 75] },
      { day: 122, popRange: [15, 20], compRange: [80, 95] },
      { day: 140, popRange: [20, 30], compRange: [95, 10] },
      { day: 152, popRange: [20, 30], compRange: [20, 30] },
      { day: 164, popRange: [40, 50], compRange: [0, 5] },
      { day: 200, popRange: [40, 50], compRange: [40, 50] },
      { day: 240, popRange: [40, 50], compRange: [10, 50] },
      { day: 300, popRange: [40, 50], compRange: [70, 85] },
      { day: 320, popRange: [40, 50], compRange: [10, 85] },
    ],
    updateChance: 10,
    gap: 31,
    newEntry: 'newSingleDate',
    updateEntry: 'updateSingleDate',
  },
  dmse: { // Utilization of the PHQ-9 to Monitor Depression Symptoms for Adolescents and Adults
    subs: 3,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [20, 30], compRange: [10, 20] },
      { day: 18, popRange: [5, 13], compRange: [90, 95] },
      { day: 30, popRange: [10, 20], compRange: [10, 60] },
      { day: 219, popRange: [25, 35], compRange: [50, 70] },
    ],
    updateChance: 60,
    newEntry: 'newDMSE',
    updateEntry: 'updateDMSE',
  },
  drre: { // Depression Remission or Response for Adolescents and Adults
    subs: 3,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [5, 10], compRange: [15, 25] },
      { day: 49, popRange: [2, 5], compRange: [60, 80] },
      { day: 61, popRange: [50, 60], compRange: [5, 10] },
      { day: 97, popRange: [5, 13], compRange: [10, 60] },
      { day: 109, popRange: [180, 200], compRange: [90, 95] },
      { day: 134, popRange: [200, 230], compRange: [0, 5] },
    ],
    updateChance: 30,
    newEntry: 'newDRRE',
    updateEntry: 'updateDRRE',
  },
  dsfe: { // Depression Screening and Follow-Up for Adolescents and Adults
    subs: 2,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [5, 10], compRange: [15, 25] },
      { day: 6, popRange: [20, 50], compRange: [70, 80] },
      { day: 18, popRange: [10, 60], compRange: [15, 30] },
      { day: 195, popRange: [200, 230], compRange: [0, 5] },
    ],
    updateChance: 60,
    newEntry: 'newDoubleBool',
    updateEntry: 'updateDoubleBool',
  },
  fum: { // Follow-Up After Emergency Department Visit for Mental Illness
    subs: 2,
    measurementYears: [2022],
    type: 'date',
    ranges: [
      { day: 0, popRange: [5, 10], compRange: [55, 65] },
      { day: 183, popRange: [30, 50], compRange: [80, 90] },
      { day: 213, popRange: [20, 30], compRange: [65, 72] },
    ],
    updateChance: 0,
    gap: 31,
    newEntry: 'newFUM',
    updateEntry: 'updateFUM',
  },
  imae: { // Immunizations for Adolescents
    subs: 5,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [5, 10], compRange: [90, 95] },
      { day: 12, popRange: [13, 17], compRange: [10, 20] },
      { day: 30, popRange: [14, 18], compRange: [40, 60] },
      { day: 37, popRange: [11, 12], compRange: [5, 10] },
      { day: 55, popRange: [26, 32], compRange: [15, 80] },
      { day: 85, popRange: [11, 13], compRange: [25, 40] },
      { day: 109, popRange: [31, 51], compRange: [25, 80] },
      { day: 152, popRange: [26, 42], compRange: [15, 18] },
      { day: 164, popRange: [10, 22], compRange: [85, 90] },
      { day: 256, popRange: [10, 20], compRange: [5, 10] },
      { day: 274, popRange: [20, 40], compRange: [85, 90] },
    ],
    updateChance: 35,
    newEntry: 'newIMAE',
    updateEntry: 'updateIMAE',
  },
  pdse: { // Postpartum Depression Screening and Follow-Up
    subs: 2,
    measurementYears: [2022],
    type: 'object',
    ranges: [
      { day: 0, popRange: [5, 10], compRange: [10, 100] },
    ],
    updateChance: 5,
    newEntry: 'newDoubleDeliveries',
    updateEntry: 'updateDoubleDeliveries',
  },
  pnde: { // Prenatal Depression Screening and Follow-Up
    subs: 2,
    measurementYears: [2022],
    type: 'object',
    ranges: [
      { day: 0, popRange: [5, 10], compRange: [5, 7] },
    ],
    updateChance: 95,
    newEntry: 'newDoubleDeliveries',
    updateEntry: 'updateDoubleDeliveries',
  },
  prse: { // Prenatal Immunization Status
    subs: 3,
    measurementYears: [2022],
    type: 'object',
    ranges: [
      { day: 0, popRange: [8, 15], compRange: [10, 20] },
      { day: 18, popRange: [10, 12], compRange: [90, 95] },
      { day: 30, popRange: [10, 12], compRange: [40, 60] },
      { day: 43, popRange: [10, 12], compRange: [20, 30] },
      { day: 65, popRange: [10, 12], compRange: [70, 80] },
      { day: 80, popRange: [10, 12], compRange: [50, 60] },
      { day: 100, popRange: [10, 12], compRange: [20, 30] },
      { day: 140, popRange: [10, 12], compRange: [60, 70] },
      { day: 165, popRange: [10, 12], compRange: [30, 50] },
      { day: 200, popRange: [10, 12], compRange: [10, 20] },
      { day: 240, popRange: [10, 12], compRange: [40, 50] },
      { day: 280, popRange: [10, 12], compRange: [20, 30] },
      { day: 304, popRange: [15, 25], compRange: [90, 100] },
    ],
    updateChance: 50,
    newEntry: 'newPRSE',
    updateEntry: 'updatePRSE',
  },
  psa: { // Non-Recommended PSA-Based (prostate-specific antigen) Screening in Older Men
    subs: 1,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [10, 10], compRange: [68, 82] },
      { day: 30, popRange: [15, 20], compRange: [0, 5] },
    ],
    updateChance: 5,
    newEntry: 'newSingleBool',
    updateEntry: 'updateSingleBool',
  },
  uop: { // Use of Opioids From Multiple Providers
    subs: 3,
    measurementYears: [2022],
    type: 'bool',
    ranges: [
      { day: 0, popRange: [10, 10], compRange: [0, 5] },
      { day: 30, popRange: [15, 20], compRange: [80, 92] },
    ],
    updateChance: 5,
    newEntry: 'newTripleDependBool',
    updateEntry: 'updateTripleDependBool',
  },
  uri: { // Appropriate Treatment for Upper Respiratory Infection
    subs: 1,
    measurementYears: [2022],
    type: 'date',
    gap: 31,
    ranges: [
      { day: 0, popRange: [2, 5], compRange: [78, 90] },
      { day: 91, popRange: [2, 3], compRange: [10, 15] },
      { day: 183, popRange: [4, 5], compRange: [80, 85] },
      { day: 274, popRange: [10, 15], compRange: [20, 30] },
    ],
    updateChance: 25,
    newEntry: 'newSingleDate',
    updateEntry: 'updateSingleDate',
  },
};

// const coveragePlans = [
//   { code: 'MCPOL', display: 'Managed Care Policy' },
//   { code: 'HMO', display: 'Health Maintenance Organization Policy' },
//   { code: 'PPO', display: 'Preferred Provider Organization Policy' },
// ];

const coveragePlans = [
  { code: 'MCPOL', display: 'Anthem' },
  { code: 'HMO', display: 'Cigna' },
  { code: 'PPO', display: 'BlueCross/BlueShield' },
];

const providerOptions = [
  {
    measures: ['aab', 'adde', 'aise', 'apme', 'asfe', 'bcse', 'ccs', 'cise', 'cole', 'cou',
      'cwp', 'dmse', 'drre', 'dsfe', 'fum', 'imae', 'pdse', 'pnde', 'prse', 'psa', 'uop', 'uri'],
    providers: [{
      reference: 'Organization?identifier=71533123',
      display: 'Norton Hill Carecenter',
    }, {
      reference: 'Practitioner?identifier=2143',
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
      reference: 'Organization?identifier=81533123',
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

const chooseGender = (measure) => {
  if (['bcse', 'ccs', 'pdse', 'pnde', 'prse'].includes(measure)) {
    return 'female';
  }
  return Math.random() < 0.5 ? 'female' : 'male';
};

const chooseBirthSex = (gender) => {
  if (gender === 'male') {
    return Math.random() < 0.01 ? 'female' : 'male';
  }
  if (gender === 'female') {
    return Math.random() < 0.01 ? 'male' : 'female';
  }
  return 'x';
};

const generateRandomDateFormatted = () => {
  // Get the timestamps of the start and end dates
  const startTime = new Date('1940-01-01').getTime();
  const endTime = new Date().getTime(); // Current date

  // Generate a random timestamp between the start and end times
  const randomTime = startTime + Math.random() * (endTime - startTime);

  // Create a new Date object from the random timestamp
  const randomDate = new Date(randomTime);

  // Format the date as "YYYY-MM-DD" using toISOString() and splitting the T
  const formattedDate = randomDate.toISOString().split('T')[0];

  return formattedDate;
};

const getRandomValueFromArray = (values) => {
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};

const getRandomGivenName = (gender) => {
  if (gender === 'male') {
    return getRandomValueFromArray(givenMaleNames);
  }
  if (gender === 'female') {
    return getRandomValueFromArray(givenFemaleNames);
  }
  return getRandomValueFromArray([...givenMaleNames, ...givenFemaleNames]);
};

const generatePatientInfo = (measure) => {
  const gender = chooseGender(measure);
  const patientInfo = {
    gender,
    dob: generateRandomDateFormatted(),
    deceased: false,
    deceasedDate: null,
    zip: getRandomValueFromArray(southCarolinaZipCodes),
    birthSex: chooseBirthSex(gender),
    active: true,
    raceCode: getRandomValueFromArray(raceCodes),
    ethnicityCode: getRandomValueFromArray(ethnicityCodes),
    given: getRandomGivenName(gender),
    family: getRandomValueFromArray(surnames),
  };
  return patientInfo;
};

module.exports = {
  template,
  coveragePlans,
  providerOptions,
  generatePatientInfo,
};
