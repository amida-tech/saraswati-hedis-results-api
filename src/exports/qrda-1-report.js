const { XMLBuilder } = require('fast-xml-parser');
const utils = require('./qrda-utils');

const usRealmHeader = {
  '@_root': '2.16.840.1.113883.10.20.22.1.1',
  '@_extension': '2015-08-01',
};

const healthcareSystemName = 'Health R US';

const getMeasureEntries = (memberInfoList, measureInfo) => {
  const entryList = [];
  memberInfoList.forEach((member) => {
    entryList.push({
      organizer: {
        '@_classCode': 'CLUSTER',
        '@_moodCode': 'EVN',
        templateId: [{ '@_root': '2.16.840.1.113883.10.20.24.3.98' }, { '@_root': '2.16.840.1.113883.10.20.24.3.97' }],
        id: { '@_root': member.measurementType },
        statusCode: { '@_code': 'completed' },
        reference: {
          '@_typeCode': 'REFR',
          externalDocument: {
            '@_classCode': 'DOC',
            '@_moodCode': 'EVN',
            // This is the version specific identifier for the eMeasure
            id: { '@_root': '2.16.840.1.113883.4.738', '@_extension': member.measurementType },
            text: measureInfo[member.measurementType].title,
          },
        },
      },
    });
  });

  return entryList;
};

const createPatientData = (member) => {
  let entryList = [];
  switch (member.measurementType) {
    case 'aab':
      entryList = utils.handleAabPatientData(member);
      break;
    case 'adde':
      entryList = utils.handleAddePatientData(member);
      break;
    case 'aise':
      entryList = utils.handleAisePatientData(member);
      break;
    case 'asfe':
      entryList = utils.handleAsfePatientData(member);
      break;
    case 'ccs':
      entryList = utils.handleCcsPatientData(member);
      break;
    case 'cise':
      entryList = utils.handleCisePatientData(member);
      break;
    case 'cole':
      entryList = utils.handleColePatientData(member);
      break;
    case 'cwp':
      entryList = utils.handleCwpPatientData(member);
      break;
    case 'dmse':
      entryList = utils.handleDmsePatientData(member);
      break;
    case 'drre':
      entryList = utils.handleDrrePatientData(member);
      break;
    case 'dsfe':
      entryList = utils.handleDsfePatientData(member);
      break;
    case 'fum':
      entryList = utils.handleFumPatientData(member);
      break;
    case 'imae':
      entryList = utils.handleImaePatientData(member);
      break;
    case 'pdse':
    case 'pnde':
    case 'prse':
      entryList = utils.handleDeliveriesPatientData(member);
      break;
    case 'uri':
      entryList = utils.handleUriPatientData(member);
      break;
    case 'apme':
    case 'bcse':
    case 'cou':
    case 'psa':
    case 'uop':
    default:
      entryList = [];
  }
  // TODO get payer information
  entryList.push({
    '@_typeCode': 'DRV',
    observation: {
      '@_classCode': 'OBS',
      '@_moodCode': 'EVN',
      templateId: { '@_root': '2.16.840.1.113883.10.20.24.3.55' },
      id: { '@_root': `${member.memberId}-payer` },
      code: {
        '@_code': '48768-6',
        '@_codeSystem': utils.loincCodeSystem,
        '@_codeSystemName': 'LOINC',
        '@_dieplayName': 'Payment Source',
      },
      statusCode: { '@_code': 'completed' },
      effectiveTime: {
        low: { '@_value': '20220101' },
        high: { '@_value': '20221231' },
      },
      value: {
        '@_xsi:type': 'CD',
        '@_code': '1',
        '@_codeSystem': '2.16.840.1.113883.3.221.5',
        '@_codeSystemName': 'Source of Payment Typology',
        '@_displayName': 'Medicare',
      },
    },
  });

  return entryList;
};

const qrda1Export = (memberInfo, measureInfo) => {
  const options = {
    ignoreAttributes: false,
    format: true,
    allowBooleanAttributes: true,
  };

  const date = new Date();
  const dateString = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

  const clinicalDocument = {
    ClinicalDocument: {
      '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@_xmlns': 'urn:hl7-org:v3',
      /*
      ********************************************************
      CDA Header
      ********************************************************
      */
      realmCode: utils.realmCode,
      typeId: utils.clinicalDocumentBase,
      templateId: [
        usRealmHeader,
        // QRDA Category I Framework (V4)
        { '@_root': '2.16.840.1.113883.10.20.24.1.1', '@_extension': '2017-08-01' },
        // QDM-based QRDA (V7)
        { '@_root': '2.16.840.1.113883.10.20.24.1.2', '@_extension': '2019-12-01' },
        // QRDA Category I Report - CMS (V7)
        { '@_root': '2.16.840.1.113883.10.20.24.1.3', '@_extension': '2020-02-01' },
      ],
      id: { '@_root': `qrda1-${memberInfo[0].memberId}` },
      code: {
        '@_code': '55182-0',
        '@_codeSystem': utils.loincCodeSystem,
        '@_codeSystemName': 'LOINC',
        '@_displayName': 'Quality Measure Report',
      },
      title: 'QRDA Category I Report',
      effectiveTime: { '@_value': utils.createDateString(new Date()) },
      confidentialityCode: utils.confidentialityCode,
      languageCode: utils.languageCode,
      recordTarget: {
        patientRole: {
          /* 2 options: Patient's Medicare HIC number -->
            <id root="2.16.840.1.113883.4.572" extension="HIC_number_goes_here" />
            or Patient's Medicare Beneficiary Identifier (MBI) -->
      <id root="2.16.840.1.113883.4.927" extension="Medicare_Beneficiary_Identifier_goes_here"/> */
          id: {
            '@_root': '2.16.840.1.113883.4.572',
            '@_extension': memberInfo[0].memberId,
          },
          addr: { // TODO, get patient address
            '@_use': 'H',
            streetAddressLine: '12345 Rainbow Road',
            city: 'Outside',
            state: 'Space',
            postalCode: '00000',
            country: 'US',
          },
          telecom: {
            '@_use': 'HP',
            '@_value': '5558675309',
          },
          // TODO get a patient with data
          patient: {
            name: {
              given: 'Fronk',
              family: 'Gilderstein',
            },
            administrativeGenderCode: {
              '@_code': 'M',
              '@_codeSystem': '2.16.840.1.113883.5.1',
            },
            birthTime: { '@_value': '19690420' },
            maritalStatusCode: { // not required
              '@_code': 'S',
              '@_displayName': 'Single',
              '@_codeSystem': '2.16.840.1.113883.5.2',
              '@_codeSystemName': 'MaritalStatusCode',
            },
            raceCode: {
              '@_code': '2106-3',
              '@_codeSystem': '2.16.840.1.114222.4.11.836',
              '@_displayName': 'White',
            },
            ethnicGroupCode: {
              '@_code': '2186-5',
              '@_codeSystem': '2.16.840.1.114222.4.11.837',
              '@_displayName': 'Not Hispanic or Latino',
            },
          },
        },
      },
      // Author can be a person or a device
      author: utils.createAuthor(healthcareSystemName, dateString),
      // This assignedCustodian represents the organization that owns and reports the data
      custodian: {
        assignedCustodian: {
          representedCustodianOrganization: {
            id: {
              '@_root': '2.16.840.1.113883.4.336',
              '@_extension': '1234567893',
            },
            name: healthcareSystemName,
            telecom: {
              '@_use': 'WP',
              '@_value': '5558675309',
            },
            addr: {
              '@_use': 'WP',
              streetAddressLine: '666 Heck Lane',
              city: 'Underworld',
              state: 'FL',
              postalCode: '666666',
              country: 'US',
            },
          },
        },
      },
      // Who is receiving this document
      informationRecipient: {
        intendedRecipient: {
          /* informationRecipient: {
            name: {
              given: 'Docter',
              family: 'Mister',
              suffix: 'Guy',
            },
          }, */
          id: { '@_root': '2.16.840.1.113883.3.249.7', '@_extension': 'HQR_IQR' },
          // receivedOrganization: {
          // name: healthcareSystemName,
          // },
        },
      },
      participant: {
        '@_typeCode': 'DEV',
        associatedEntity: {
          '@_classCode': 'RGPR',
          // CMS EHR Certification Number
          id: {
            '@_root': '2.16.840.1.113883.3.2074.1',
            '@_extension': '0015HBC1D1EFG1H',
          },
        },
      },
      // The single person legally responsible for the document
      /* legalAuthenticator: {
        time: { '@_value': dateString },
        signatureCode: { '@_code': 'S' },
        assignedEntity: {
          id: {
            '@_root': '2.16.840.1.113883.4.6',
            '@_extension': '1234567893',
          },
          telecom: {
            '@_use': 'WP',
            '@_value': '5558675309',
          },
        },
      }, */
      /*
      ********************************************************
      CDA Body
      ********************************************************
      */
      component: {
        structuredBody: {
          component: [{
            /*
            ********************************************************
            Measure Section
            ********************************************************
            */
            section: {
              // This is the templateId for Measure Section and Measure Section QDM
              templateId: [utils.measureSectionTemplate, { '@_root': '2.16.840.1.113883.10.20.24.2.3' }],
              // This is the LOINC code for "Measure document"
              code: {
                '@_code': '55186-1',
                '@_codeSystem': utils.loincCodeSystem,
              },
              title: 'Measure Section',
              text: 'The section of measures',
              entry: getMeasureEntries(memberInfo, measureInfo),
            },
          },
          /*
          ********************************************************
          Reporting Parameters Section
          ********************************************************
          */
          {
            section: {
              templateId: [
                // Reporting Parameters Section
                { '@_root': '2.16.840.1.113883.10.20.17.2.1' },
                // Reporting Parameters Section CMS
                { '@_root': '2.16.840.1.113883.10.20.17.2.1.1', '@_extension': '2016-03-01' },
              ],
              id: { '@_root': 'reporting-parameters-id' },
              code: {
                '@_code': '55187-9',
                '@_codeSystem': utils.loincCodeSystem,
              },
              title: 'Reporting Parameters',
              text: 'Reporting Parameters',
              entry: {
                '@_typeCode': 'DRV',
                act: {
                  '@_classCode': 'ACT',
                  '@_moodCode': 'EVN',
                  templateId: [
                    // Reporting Parameters Act
                    { '@_root': '2.16.840.1.113883.10.20.17.3.8' },
                    // Reporting Parameters Act CMS
                    { '@_root': '2.16.840.1.113883.10.20.17.3.8.1', '@_extension': '2016-03-01' },
                  ],
                  id: { '@_root': 'reporting-parameters-act-id' },
                  code: {
                    '@_code': '252116004',
                    '@_codeSystem': '2.16.840.1.113883.6.96',
                    '@_displayName': 'Observation Parameters',
                  },
                  effectiveTime: {
                    low: { '@_value': '20220101' },
                    high: { '@_value': utils.createDateString(new Date()) },
                  },
                },
              },
            },
          },
          /*
          ********************************************************
          Patient Data Section
          ********************************************************
          */
          {
            section: {
              templateId: [
                // Patient Data Section
                { '@_root': '2.16.840.1.113883.10.20.17.2.4' },
                // Patient Data Section QDM (V7)
                { '@_root': '2.16.840.1.113883.10.20.24.2.1', '@_extension': '2019-12-01' },
                // Patient Data Section QDM (V7) - CMS
                { '@_root': '2.16.840.1.113883.10.20.24.2.1.1', '@_extension': '2020-02-01' },
              ],
              id: { '@_root': 'patient-data-id' },
              code: {
                '@_code': '55188-7',
                '@_codeSystem': utils.loincCodeSystem,
              },
              title: 'Patient Data',
              text: 'Patient Data',
              entry: createPatientData(memberInfo[0]),
            },
          }],
        },
      },
    },
  };

  const builder = new XMLBuilder(options);
  const xmlContent = builder.build(clinicalDocument);

  return xmlContent;
};

module.exports = {
  qrda1Export,
};
