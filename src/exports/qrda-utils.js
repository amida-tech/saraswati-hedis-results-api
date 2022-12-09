const realmCode = {
  '@_code': 'US',
};

const clinicalDocumentBase = {
  '@_root': '2.16.840.1.113883.1.3',
  '@_extension': 'POCD_HD000040',
};

const loincCodeSystem = '2.16.840.1.113883.6.1';

const confidentialityCode = {
  '@_codeSystem': '2.16.840.1.113883.5.25',
  '@_code': 'N',
};

const measureSectionTemplate = { '@_root': '2.16.840.1.113883.10.20.24.2.2' };

const languageCode = { '@_code': 'en' };

const padZero = (num) => {
  if (num < 10) {
    return `0${num}`;
  }
  return num;
};

const createDateString = (date) => `${date.getFullYear()}${padZero(date.getMonth() + 1)}${padZero(date.getDate())}`;

const createAuthor = (healthcareSystemName, date) => ({
  time: { '@_value': date },
  assignedAuthor: {
    id: { '@_root': 'software_author' },
    assignedAuthoringDevice: {
      softwareName: 'Saraswati',
    },
    representedOrganization: {
      /* The organization id is optional, but the name is required
         id: {
          '@_root': '2.16.840.1.113883.19.5',
          '@_extension': '223344',
        }, */
      name: healthcareSystemName,
    },
  },
});

const createProcedureXml = (claim) => ({
  '@_typeCode': 'DRIV',
  procedure: {
    '@_classCode': 'PROC',
    '@_moodCode': 'EVN',
    templateId: [
      // Conforms to C-CDA R2.1 Procedure Activity Procedure (V2)
      { '@_root': '2.16.840.1.113883.10.20.22.4.14', '@_extension': '2014-06-09' },
      // Procedure Performed (V6)
      { '@_root': '2.16.840.1.113883.10.20.24.3.64', '@_extension': '2019-12-01' },
    ],
    id: {
      '@_root': claim.id,
    },
    code: {
      '@_code': claim.code,
    },
    statusCode: 'completed',
    effectiveTime: {
      low: { '@_value': '20220101' },
      high: { '@_value': createDateString(new Date()) },
    },
  },
});

const getAabPatientData = (claims, qualifyingEpisodes) => {
  const validClaims = claims.filter(
    (claim) => (claim.procedure != null && claim.item != null)
      && claim.item.find((item) => {
      // eslint-disable-next-line no-restricted-syntax
        for (const episodeDate of qualifyingEpisodes) {
          if (item.serviced.value) {
            return item.serviced.value.startsWith(episodeDate);
          }
          if (item.serviced.start.value.startsWith(episodeDate)
          || item.serviced.end.value.startsWith(episodeDate)) {
            return true;
          }
        }
        return false;
      }),
  );
  return validClaims;
};

const handleAabPatientData = (member) => {
  const claims = getAabPatientData(member.result['Member Claims'], member.result.Denominator);
  const procedureInfo = [];
  claims.forEach((claim) => claim.procedure
    .forEach((procedure, procIndex) => procedure.procedure.coding
      .forEach((coding, codeIndex) => procedureInfo
        .push({
          id: `${claim.id.value}-${procIndex}-${codeIndex}`,
          code: coding.code.value,
        }))));
  return procedureInfo.map((claim) => createProcedureXml(claim));
};

const getAddePatientData = (claims, prescStartDate) => {
  const validClaims = claims.filter(
    (claim) => claim.LineItem != null
      && claim.LineItem.find((item) => {
        if (item.serviced.value) {
          return item.serviced.value.startsWith(prescStartDate);
        }
        if (item.serviced.start.value.startsWith(prescStartDate)
          || item.serviced.end.value.startsWith(prescStartDate)) {
          return true;
        }
        return false;
      }),
  );
  return validClaims;
};

const createMedDispensedXml = (claim) => ({
  '@_typeCode': 'DRIV',
  act: {
    '@_classCode': 'ACT',
    '@_moodCode': 'EVN',
    // Medication Dispensed Act (V4)
    templateId: { '@_root': '2.16.840.1.113883.10.20.24.3.139', '@_extension': '2019-12-01' },
    code: {
      '@_code': 'SPLY',
      '@_codeSystem': '2.16.840.1.113883.5.6',
      '@_displayName': 'Supply',
      '@_codeSystemName': 'ActClass',
    },
    entryRelationship: {
      '@_typeCode': 'SUBJ',
      supply: {
        '@_classCode': 'SPLY',
        '@_moodCode': 'EVN',
        templateId: [
          // Conforms to C-CDA R2.1 Medication Dispense (V2) template
          { '@_root': '2.16.840.1.113883.10.20.22.4.18', '@_extension': '2014-06-09' },
          // Medication Dispensed (V6)
          { '@_root': '2.16.840.1.113883.10.20.24.3.45', '@_extension': '2019-12-01' },
        ],
        id: { '@_root': claim.id },
        statusCode: { '@_code': 'completed' },
        effectiveTime: { '@_value': createDateString(claim.date) },
        product: {
          manufacturedProduct: {
            '@_classCode': 'MANU',
            // Medication Information (V2)
            templateId: { '@_root': '2.16.840.1.113883.10.20.22.4.23', '@_extension': '2014-06-09' },
            id: { '@_root': claim.id },
            manufacturedMaterial: {
              code: { '@_code': claim.code },
            },
          },
        },
      },
    },
  },
});

const handleAddePatientData = (member) => {
  const claims = getAddePatientData(member.result['ADHD Medication Dispensed'], member.result['Index Prescription Start Date']);
  const productInfo = [];
  claims.forEach((claim) => claim.LineItem
    .forEach((item, itemIndex) => item.productOrService.coding
      .forEach((coding, codeIndex) => productInfo
        .push({
          id: `${claim.Claim.id.value}-${itemIndex}-${codeIndex}`,
          code: coding.code.value,
          date: new Date(member.result['Index Prescription Start Date']),
        }))));
  return productInfo.map((claim) => createMedDispensedXml(claim));
};

module.exports = {
  realmCode,
  clinicalDocumentBase,
  loincCodeSystem,
  confidentialityCode,
  languageCode,
  createAuthor,
  measureSectionTemplate,
  handleAabPatientData,
  handleAddePatientData,
  createDateString,
};
