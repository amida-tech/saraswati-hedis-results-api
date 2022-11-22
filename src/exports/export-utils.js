const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

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

const createResultComponent = (result, fieldName) => {
  const valueObject = getValueObject(fieldName);
  return {
    observation: {
      '@_classCode': 'OBS',
      '@_moodCode': 'EVN',
      templateId: [
        {
          '@_root': '2.16.840.1.113883.10.20.27.3.5',
          '@_extension': '2016-09-01',
        },
        {
          '@_root': '2.16.840.1.113883.10.20.27.3.16',
          '@_extension': '2019-05-01',
        },
      ],
      statusCode: { '@_code': 'completed' },
      value: valueObject,
      entryRelationship: {
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
            '@_displayName': 'rate aggregation',
          },
          value: {
            '@_xsi:type': 'INT',
            '@_value': result[fieldName],
          },
          methodCode: {
            '@_code': 'COUNT',
            '@_codeSystem': '2.16.840.1.113883.5.84',
            '@_codeSystemName': 'ObservationMethod',
            '@_displayName': 'Count',
          },
        },
      },
      // Supplemental stratifications go here
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

const qrda3Export = (results, measureInfo) => {
  const options = {
    ignoreAttributes: false,
    format: true,
  };

  const clinicalDocument = {
    ClinicalDocument: {
      '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@_xmlns': 'urn:hl7-org:v3',
      /*
      ********************************************************
      CDA Header
      ********************************************************
      */
      realmCode: {
        '@_code': 'US',
      },
      typeId: {
        '@_root': '2.16.840.1.113883.1.3',
        '@_extension': 'POCD_HD000040',
      },
      templateId: {
        '@_root': '2.16.840.1.113883.10.20.27.1.1',
        '@_extension': '2020-12-01',
      },
      id: {
        '@_root': 'clinicalDocumentTest',
      },
      code: {
        '@_code': '55184-6',
        '@_codeSystem': '2.16.840.1.113883.6.1',
        '@_codeSystemName': 'LOINC',
        '@_displayName': 'Quality Reporting Document Architecture Summary Report',
      },
      title: 'Sample QRDA Category III Summary Report',
      effectiveTime: { '@_value': '20220101061231' },
      confidentialityCode: {
        '@_codeSystem': '2.16.840.1.113883.5.25',
        '@_code': 'N',
      },
      languageCode: { '@_code': 'en' },
      versionNumber: { '@_value': '1' },
      recordTarget: {
        patientRole: {
          id: { '@_nullFlavor': 'NA' },
        },
      },
      author: {
        time: { '@_value': '20210101061231' },
        assignedAuthor: {
          id: { '@_root': 'software_author' },
          assignedAuthoringDevice: {
            softwareName: 'Saraswati',
          },
          representedOrganization: {
            id: {
              '@_root': '2.16.840.1.113883.19.5',
              '@_extension': '223344',
            },
            name: 'Health R US',
          },
        },
      },
      custodian: {
        assignedCustodian: {
          representedCustodianOrganization: {
            id: {
              '@_root': '2.16.840.1.113883.19.5',
              '@_extension': '223344',
            },
            name: 'Health R US',
          },
        },
      },
      legalAuthenticator: {
        time: { '@_value': '20210101061231' },
        signatureCode: { '@_code': 'S' },
        assignedEntity: {
          id: { '@_root': 'legal-entity' },
          representedOrganization: {
            id: {
              '@_root': '2.16.840.1.113883.19.5',
              '@_extension': '223344',
            },
            name: 'Health R US',
          },
        },
      },
      participant: {
        '@_typeCode': 'DEV',
        associatedEntity: {
          '@_classCode': 'RGPR',
          id: {
            '@_root': '2.16.840.1.113883.3.2074.1',
            '@_extension': '0015EUK17H3DCM9',
          },
          code: {
            '@_code': '129465004',
            '@_displayName': 'medical record, device',
            '@_codeSystem': '2.16.840.1.113883.6.96',
            '@_codeSystemName': 'SNOMED-CT',
          },
        },
      },
      documentationOf: {
        '@_typeCode': 'DOC',
        serviceEvent: {
          '@_classCode': 'PCPR',
          performer: {
            '@_typeCode': 'PRF',
            assignedEntity: {
              id: {
                '@_root': '2.16.840.1.113883.4.6',
                '@_nullFlavor': 'NA',
              },
              representedOrganization: {
                id: {
                  '@_root': '2.16.840.1.113883.4.2',
                  '@_extension': 'extension',
                },
                name: 'Health R US',
              },
            },
          },
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
                { '@_root': '2.16.840.1.113883.10.20.24.2.2' },
                {
                  '@_root': '2.16.840.1.113883.10.20.27.2.1',
                  '@_extension': '2020-12-01',
                },
              ],
              code: {
                '@_code': '55186-1',
                '@_codeSystem': '2.16.840.1.113883.6.1',
                '@_displayName': 'measure section',
              },
              title: 'Measure Section',
              entry: [
                {
                  '@_typeCode': 'DRIV',
                  act: {
                    '@_classCode': 'ACT',
                    '@_moodCode': 'EVN',
                    templateId: {
                      '@_root': '2.16.840.1.113883.10.20.17.3.8',
                      '@_extension': '2020-12-01',
                    },
                    id: { '@_root': 'measure-section-1' },
                    code: {
                      '@_code': '252116004',
                      '@_codeSystem': '2.16.840.1.113883.6.96',
                      '@_displayName': 'Observation Parameters',
                    },
                    effectiveTime: {
                      low: { '@_value': '20220101' },
                      high: { '@_value': '20221231' },
                    },
                  },
                },
                {
                  organizer: {
                    '@_classCode': 'cluster',
                    '@_moodCode': 'EVN',
                    templateId: [
                      { '@_root': '2.16.840.1.113883.10.20.24.3.98' },
                      {
                        '@_root': '2.16.840.1.113883.10.20.27.3.1',
                        '@_extension': '2020-12-01',
                      },
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
                          '@_codeSystem': '2.16.840.1.113883.6.1',
                          '@_codeSystemName': 'LOINC',
                          '@_displayName': 'Health Quality Measure Document',
                        },
                        text: measureInfo[results[0].measure].title,
                      },
                    },
                    component: [
                      createResultComponent(results[0], 'initialPopulation'),
                      createResultComponent(results[0], 'exclusions'),
                      createResultComponent(results[0], 'denominator'),
                      createResultComponent(results[0], 'numerator'),
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
