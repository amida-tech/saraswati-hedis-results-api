const { XMLBuilder } = require('fast-xml-parser');
const utils = require('./qrda-utils');

const usRealmHeader = {
  '@_root': '2.16.840.1.113883.10.20.22.1.1',
  '@_extension': '2015-08-01',
};

const healthcareSystemName = 'Health R US';

const qrda1Export = (memberInfo) => {
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
      templateId: usRealmHeader,
      id: `qrda1-${memberInfo[0].memberId}`,
      code: {
        '@_code': '55182-6',
        '@_codeSystem': utils.loincCodeSystem,
        '@_codeSystemName': 'LOINC',
        '@_displayName': 'Quality Measure Report',
      },
      text: 'QRDA Category I Report',
      effectiveTime: dateString,
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
            country: 'Existence',
          },
          telcom: {
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
            birthTime: '19690420',
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
              '@_root': '2.16.840.1.113883.4.6',
              '@_extension': '223344',
            },
            name: healthcareSystemName,
            telcom: {
              '@_use': 'WP',
              '@_value': '5558675309',
            },
            addr: {
              '@_use': 'WP',
              streetAddressLine: '666 Heck Lane',
              city: 'Underworld',
              state: 'FL',
              postalCode: '666666',
              country: 'Existence',
            },
          },
        },
      },
      // Who is receiving this document
      informationRecipient: {
        intendedRecipient: {
          informationRecipient: {
            name: {
              given: 'Docter',
              family: 'Mister',
              suffix: 'Guy',
            },
          },
          receivedOrganization: {
            name: healthcareSystemName,
          },
        },
      },
      // The single person legally responsible for the document
      legalAuthenticator: {
        time: { '@_value': dateString },
        signatureCode: { '@_code': 'S' },
        assignedEntity: {
          id: {
            '@_extension': 'legalAuthenticator',
            '@_root': '2.16.840.1.113883.4.6',
          },
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
