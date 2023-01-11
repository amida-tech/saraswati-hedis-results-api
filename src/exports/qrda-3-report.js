const { XMLBuilder } = require('fast-xml-parser');

const utils = require('./qrda-utils');

const measureDataV3Template = {
  '@_root': '2.16.840.1.113883.10.20.27.3.5',
  '@_extension': '2016-09-01',
};

const measureDataV4Template = {
  '@_root': '2.16.840.1.113883.10.20.27.3.16',
  '@_extension': '2019-05-01',
};

const qrda3ReportV5Template = {
  '@_root': '2.16.840.1.113883.10.20.27.1.1',
  '@_extension': '2017-06-01',
};

const qrda3MeasureSectionV5Template = {
  '@_root': '2.16.840.1.113883.10.20.27.2.1',
  '@_extension': '2017-06-01',
};

const performanceRateTemplate = {
  '@_root': '2.16.840.1.113883.10.20.27.3.30',
  '@_extension': '2016-09-01',
};

const perfRatePropMeasureV3Template = {
  '@_root': '2.16.840.1.113883.10.20.27.3.14',
  '@_extension': '2016-09-01',
};

const reportingParametersTemplate = { '@_root': '2.16.840.1.113883.10.20.17.3.8' };

const measureReferenceResultsV3Template = {
  '@_root': '2.16.840.1.113883.10.20.27.3.1',
  '@_extension': '2016-09-01',
};

const measurementPeriod = {
  low: { '@_value': '20220101' },
  high: { '@_value': '20221231' },
};

const ipopValueObject = () => ({
  '@_xsi:type': 'CD',
  '@_code': 'IPOP',
  '@_codeSystem': '2.16.840.1.113883.5.4',
  '@_codeSystemName': 'ActCode',
});

const exclusionsValueObject = () => ({
  '@_xsi:type': 'CD',
  '@_code': 'DENEX',
  '@_codeSystem': '2.16.840.1.113883.5.1063',
  '@_codeSystemName': 'ObservationValue',
});

const denominatorValueObject = () => ({
  '@_xsi:type': 'CD',
  '@_code': 'DENOM',
  '@_codeSystem': '2.16.840.1.113883.5.1063',
  '@_codeSystemName': 'ObservationValue',
});

const numeratorValueObject = () => ({
  '@_xsi:type': 'CD',
  '@_code': 'NUMER',
  '@_codeSystem': '2.16.840.1.113883.5.1063',
  '@_codeSystemName': 'ObservationValue',
});

const getMeasureText = (result, measureInfo) => {
  const resultInfo = measureInfo[result.measure];
  if (resultInfo.description) {
    return `${resultInfo.title} - ${resultInfo.title}`;
  }
  return resultInfo.title;
};

const healthcareSystemName = 'Health R US';

const getValueObject = (fieldName) => {
  switch (fieldName) {
    case 'initialPopulation':
      return ipopValueObject();
    case 'exclusions':
      return exclusionsValueObject();
    case 'denominator':
      return denominatorValueObject();
    case 'numerator':
      return numeratorValueObject();
    default:
      return null;
  }
};

const entryRelationshipCount = (value) => ({
  '@_typeCode': 'SUBJ',
  '@_inversionInd': 'true',
  observation: {
    '@_classCode': 'OBS',
    '@_moodCode': 'EVN',
    templateId: { '@_root': '2.16.840.1.113883.10.20.27.3.3' },
    code: {
      '@_code': 'MSRAGG',
      '@_codeSystem': '2.16.840.1.113883.5.4',
      '@_codeSystemName': 'ActCode',
      '@_displayName': 'Rate Aggregation',
    },
    value: {
      '@_xsi:type': 'INT',
      '@_value': value,
    },
    methodCode: {
      '@_code': 'COUNT',
      '@_codeSystem': '2.16.840.1.113883.5.84',
      '@_codeSystemName': 'ObservationMethod',
      '@_displayName': 'Count',
    },
  },
});

const createResultComponent = (result, fieldName) => {
  const valueObject = getValueObject(fieldName);
  return {
    observation: {
      '@_classCode': 'OBS',
      '@_moodCode': 'EVN',
      templateId: [
        measureDataV3Template,
        measureDataV4Template,
      ],
      code: {
        '@_code': 'ASSERTION',
        '@_codeSystem': '2.16.840.1.113883.5.4',
      },
      statusCode: { '@_code': 'completed' },
      value: valueObject,
      entryRelationship: [
        entryRelationshipCount(result[fieldName]),
        // TODO Include stratifications in result calculations - include them here
        // payer stratifications
        // TODO Add medicare, medicaid, and private health insurance
        {
          '@_typeCode': 'COMP',
          observation: {
            '@_classCode': 'OBS',
            '@_moodCode': 'EVN',
            templateId: [
              { '@_root': '2.16.840.1.113883.10.20.27.3.9', '@_extension': '2016-02-01' },
              { '@_root': '2.16.840.1.113883.10.20.27.3.18', '@_extension': '2018-05-01' },
            ],
            id: { '@_root': 'payer-other' },
            code: {
              '@_code': '48768-6',
              '@_codeSystem': utils.loincCodeSystem,
              '@_codeSystemName': 'LOINC',
              '@_displayName': 'Payment Source',
            },
            statusCode: { '@_code': 'completed' },
            value: {
              '@_xsi:type': 'CD',
              '@_nullFlavor': 'OTH',
              translation: {
                '@_code': 'D',
                '@_codeSystem': '2.16.840.1.113883.3.249.12',
                '@_codeSystemName': 'CMS Clinical Codes',
                '@_displayName': 'Other Payer',
              },
            },
            entryRelationship: entryRelationshipCount(result[fieldName]),
          },
        },
        // Sex stratifications
        {
          '@_typeCode': 'COMP',
          observation: {
            '@_classCode': 'OBS',
            '@_moodCode': 'EVN',
            templateId: { '@_root': '2.16.840.1.113883.10.20.27.3.6', '@_extension': '2016-09-01' },
            id: { '@_root': 'sex-male' },
            code: {
              '@_code': '76689-9',
              '@_codeSystem': utils.loincCodeSystem,
              '@_codeSystemName': 'LOINC',
              '@_displayName': 'Sex assigned at birth',
            },
            statusCode: { '@_code': 'completed' },
            value: {
              '@_xsi:type': 'CD',
              '@_code': 'M',
              '@_codeSystem': '2.16.840.1.113883.5.1',
              '@_codeSystemName': 'AdministrativeGenderCode',
              '@_displayName': 'Male',
            },
            // Gender count
            entryRelationship: entryRelationshipCount(result[fieldName] / 2),
          },
        },
        {
          '@_typeCode': 'COMP',
          observation: {
            '@_classCode': 'OBS',
            '@_moodCode': 'EVN',
            templateId: { '@_root': '2.16.840.1.113883.10.20.27.3.6', '@_extension': '2016-09-01' },
            id: { '@_root': 'sex-female' },
            code: {
              '@_code': '76689-9',
              '@_codeSystem': utils.loincCodeSystem,
              '@_codeSystemName': 'LOINC',
              '@_displayName': 'Sex assigned at birth',
            },
            statusCode: { '@_code': 'completed' },
            value: {
              '@_xsi:type': 'CD',
              '@_code': 'F',
              '@_codeSystem': '2.16.840.1.113883.5.1',
              '@_codeSystemName': 'AdministrativeGenderCode',
              '@_displayName': 'Female',
            },
            // Gender count
            entryRelationship: entryRelationshipCount(result[fieldName] / 2),
          },
        },
        // Race stratifications
        // TODO Add American Indian or Alaska Native, Asian, Black, and White
        {
          '@_typeCode': 'COMP',
          observation: {
            '@_classCode': 'OBS',
            '@_moodCode': 'EVN',
            templateId: { '@_root': '2.16.840.1.113883.10.20.27.3.8', '@_extension': '2016-09-01' },
            id: { '@_root': 'race-other' },
            code: {
              '@_code': '72826-1',
              '@_codeSystem': utils.loincCodeSystem,
              '@_codeSystemName': 'LOINC',
              '@_displayName': 'Race',
            },
            statusCode: { '@_code': 'completed' },
            value: {
              '@_xsi:type': 'CD',
              '@_code': '2131-1',
              '@_codeSystem': '2.16.840.1.113883.6.238',
              '@_codeSystemName': 'Race &amp; Ethnicity - CDC',
              '@_displayName': 'Other Race',
            },
            // Gender count
            entryRelationship: entryRelationshipCount(result[fieldName]),
          },
        },
        // Ethnicity stratifications
        {
          '@_typeCode': 'COMP',
          observation: {
            '@_classCode': 'OBS',
            '@_moodCode': 'EVN',
            templateId: { '@_root': '2.16.840.1.113883.10.20.27.3.7', '@_extension': '2016-09-01' },
            id: { '@_root': 'ethinicity-non-his' },
            code: {
              '@_code': '69490-1',
              '@_codeSystem': utils.loincCodeSystem,
              '@_codeSystemName': 'LOINC',
              '@_displayName': 'Ethnicity',
            },
            statusCode: { '@_code': 'completed' },
            value: {
              '@_xsi:type': 'CD',
              '@_code': '2186-5',
              '@_codeSystem': '2.16.840.1.113883.6.238',
              '@_codeSystemName': 'Race &amp; Ethnicity - CDC',
              '@_displayName': 'Not Hispanic or Latino',
            },
            // Ethnicity count
            entryRelationship: entryRelationshipCount(result[fieldName] / 2),
          },
        },
        {
          '@_typeCode': 'COMP',
          observation: {
            '@_classCode': 'OBS',
            '@_moodCode': 'EVN',
            templateId: { '@_root': '2.16.840.1.113883.10.20.27.3.7', '@_extension': '2016-09-01' },
            id: { '@_root': 'ethinicity-his' },
            code: {
              '@_code': '69490-1',
              '@_codeSystem': utils.loincCodeSystem,
              '@_codeSystemName': 'LOINC',
              '@_displayName': 'Ethnicity',
            },
            statusCode: { '@_code': 'completed' },
            value: {
              '@_xsi:type': 'CD',
              '@_code': '2135-2',
              '@_codeSystem': '2.16.840.1.113883.6.238',
              '@_codeSystemName': 'Race &amp; Ethnicity - CDC',
              '@_displayName': 'Hispanic or Latino',
            },
            // Ethnicity count
            entryRelationship: entryRelationshipCount(result[fieldName] / 2),
          },
        },
      ],
      reference: {
        '@_typeCode': 'REFR',
        externalObservation: {
          '@_classCode': 'OBS',
          '@_moodCode': 'EVN',
          id: { '@_root': `${valueObject['@_code']}-${result.measure}` },
        },
      },
    },
  };
};

const createPerformerList = (practitioners) => {
  const performerList = [];
  practitioners.forEach((practitioner) => {
    performerList.push({
      '@_typeCode': 'PRF',
      // NPI = National Provider Identifier
      assignedEntity: {
        id: {
          '@_root': '2.16.840.1.113883.4.6',
          '@_extension': '1234567893',
          '@_assigningAuthorityName': 'NPI',
        },
        // TIN = Tax Identification Number
        representedOrganization: {
          id: {
            '@_root': '2.16.840.1.113883.4.2',
            '@_extension': '123456789',
            '@_assigningAuthorityName': 'TIN',
          },
          name: practitioner.practitioner,
        },
      },
    });
  });
  return performerList;
};

const qrda3Export = (results, measureInfo, practitioners) => {
  const options = {
    ignoreAttributes: false,
    format: true,
    suppressBooleanAttributes: false,
  };

  const dateTimeString = utils.createDateTimeString(new Date());

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
        qrda3ReportV5Template,
        { '@_root': '2.16.840.1.113883.10.20.27.1.2', '@_extension': '2021-07-01' },
      ],
      id: {
        '@_root': 'clinicalDocumentTest',
      },
      code: {
        '@_code': '55184-6',
        '@_codeSystem': utils.loincCodeSystem,
        '@_codeSystemName': 'LOINC',
        '@_displayName': 'Quality Reporting Document Architecture Summary Report',
      },
      title: `${measureInfo[results.measure].displayLabel} QRDA Category III Summary Report`,
      effectiveTime: { '@_value': dateTimeString },
      confidentialityCode: utils.confidentialityCode,
      languageCode: utils.languageCode,
      versionNumber: { '@_value': '1' },
      // CDA requires this field, but multiple patients are used so it is set to null
      recordTarget: {
        patientRole: {
          id: { '@_nullFlavor': 'NA' },
        },
      },
      // Author can be a person or a device
      author: utils.createAuthor(healthcareSystemName, dateTimeString),
      // This assignedCustodian represents the organization that owns and reports the data
      custodian: {
        assignedCustodian: {
          representedCustodianOrganization: {
            id: {
              '@_root': '2.16.840.1.113883.19.5',
              '@_extension': '223344',
            },
            name: healthcareSystemName,
          },
        },
      },
      // Program for which data is being submitted
      informationRecipient: {
        intendedRecipient: {
          id: {
            '@_root': '2.16.840.1.113883.3.249.7',
            '@_extension': 'PCF',
          },
        },
      },
      // The legalAuthenticator identifies the single person legally responsible for the document
      legalAuthenticator: {
        time: { '@_value': dateTimeString },
        signatureCode: { '@_code': 'S' },
        assignedEntity: {
          id: { '@_root': 'legal-entity' },
          representedOrganization: {
            id: {
              '@_root': '2.16.840.1.113883.19.5',
              '@_extension': '223344',
            },
            name: healthcareSystemName,
          },
        },
      },
      // Participant can be a location or device (EHR). Currently setup as device
      participant: [
        {
          '@_typeCode': 'LOC',
          associatedEntity: {
            '@_classCode': 'SDLOC',
            id: { '@_root': '2.16.840.1.113883.3.249.5.3', '@_extension': '0015EUK17H3DCM9' },
            code: {
              '@_code': '394730007',
              '@_displayName': 'Healthcare Related Organization',
              '@_codeSystem': '2.16.840.1.113883.6.96',
              '@_codeSystemName': 'SNOMED-CT',
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
        {
          '@_typeCode': 'DEV',
          associatedEntity: {
            '@_classCode': 'RGPR',
            id: { '@_root': '2.16.840.1.113883.3.2074.1', '@_extension': '0015EUK17H3DCM9' },
            code: {
              '@_code': '129465004',
              '@_displayName': 'Medical Record or Device',
              '@_codeSystem': '2.16.840.1.113883.6.96',
              '@_codeSystemName': 'SNOMED-CT',
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
      ],
      // List of all providers involved with the score
      documentationOf: {
        '@_typeCode': 'DOC',
        serviceEvent: {
          '@_classCode': 'PCPR',
          performer: createPerformerList(practitioners),
        },
      },
      /*
      ********************************************************
      CDA Body
      ********************************************************
      */
      component: {
        structuredBody: {
          component: {
            section: {
              templateId: [
                utils.measureSectionTemplate,
                qrda3MeasureSectionV5Template,
                { '@_root': '2.16.840.1.113883.10.20.27.2.3', '@_extension': '2019-05-01' },
              ],
              code: {
                '@_code': '55186-1',
                '@_codeSystem': utils.loincCodeSystem,
                '@_displayName': 'Measure Section',
              },
              title: 'Measure Section',
              text: `${measureInfo[results.measure].displayLabel} Measure Section: ${results.value.toFixed(2)}% Compliance`,
              entry: [
                {
                  act: {
                    '@_classCode': 'ACT',
                    '@_moodCode': 'EVN',
                    templateId: reportingParametersTemplate,
                    id: { '@_root': `measure-section-${results.measure}` },
                    code: {
                      '@_code': '252116004',
                      '@_codeSystem': '2.16.840.1.113883.6.96',
                      '@_displayName': 'Observation Parameters',
                    },
                    effectiveTime: measurementPeriod,
                  },
                },
                {
                  organizer: {
                    '@_classCode': 'CLUSTER',
                    '@_moodCode': 'EVN',
                    templateId: [
                      // Measure Reference
                      { '@_root': '2.16.840.1.113883.10.20.24.3.98' },
                      measureReferenceResultsV3Template,
                      // Measure Reference and Results - CMS (V4)
                      { '@_root': '2.16.840.1.113883.10.20.27.3.17', '@_extension': '2019-05-01' },
                    ],
                    id: { '@_root': 'main-results' },
                    statusCode: { '@_code': 'completed' },
                    reference: {
                      '@_typeCode': 'REFR',
                      externalDocument: {
                        '@_classCode': 'DOC',
                        '@_moodCode': 'EVN',
                        id: {
                          '@_root': '2.16.840.1.113883.4.738',
                          '@_extension': '2c928085-7198-38ee-0171-9d6793ec0657',
                        },
                        code: {
                          '@_code': '57024-2',
                          '@_codeSystem': utils.loincCodeSystem,
                          '@_codeSystemName': 'LOINC',
                          '@_displayName': 'Health Quality Measure Document',
                        },
                        text: getMeasureText(results, measureInfo),
                      },
                      externalObservation: {
                        '@_classCode': 'OBS',
                        '@_moodCode': 'EVN',
                        id: { '@_root': `performance-rate-${results.measure}` },
                        text: 'The Observation',
                        code: {
                          '@_code': '55185-3',
                          '@_codeSystem': utils.loincCodeSystem,
                          '@_codeSystemName': 'LOINC',
                        },
                      },
                    },
                    component: [
                      createResultComponent(results, 'initialPopulation'),
                      createResultComponent(results, 'exclusions'),
                      createResultComponent(results, 'denominator'),
                      createResultComponent(results, 'numerator'),
                      {
                        observation: {
                          '@_classCode': 'OBS',
                          '@_moodCode': 'EVN',
                          templateId: [
                            performanceRateTemplate,
                            perfRatePropMeasureV3Template,
                            { '@_root': '2.16.840.1.113883.10.20.27.3.25', '@_extension': '2018-05-01' },
                          ],
                          code: {
                            '@_code': '72510-1',
                            '@_codeSystem': utils.loincCodeSystem,
                            '@_codeSystemName': 'LOINC',
                            '@_displayName': 'Performance Rate',
                          },
                          statusCode: { '@_code': 'completed' },
                          value: {
                            '@_xsi:type': 'REAL',
                            '@_value': Math.round(results.value) / 100,
                          },
                          reference: {
                            '@_typeCode': 'REFR',
                            externalObservation: {
                              '@_classCode': 'OBS',
                              '@_moodCode': 'EVN',
                              id: { '@_root': `performance-rate-${results.measure}` },
                              code: {
                                '@_code': 'NUMER',
                                '@_codeSystem': '2.16.840.1.113883.5.4',
                                '@_codeSystemName': 'ActCode',
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
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
  qrda3Export,
};
