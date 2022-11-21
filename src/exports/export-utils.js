const { XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser');

const qrda3Export = (results) => {
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
              templateId: { '@_root': '2.16.840.1.113883.10.20.24.2.2' },
              templateId: {
                '@_root': '2.16.840.1.113883.10.20.27.2.1',
                '@_extension': '2020-12-01',
              },
              code: {
                '@_code': '55186-1',
                '@_codeSystem': '2.16.840.1.113883.6.1',
                '@_displayName': 'measure section',
              },
              title: 'Measure Section',
              entry: {
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
              entry: {
                organizer: {
                  '@_classCode': 'cluster',
                  '@_moodCode': 'EVN',
                  templateId: { '@_root': '2.16.840.1.113883.10.20.24.3.98' },
                  templateId: {
                    '@_root': '2.16.840.1.113883.10.20.27.3.1',
                    '@_extension': '2020-12-01',
                  },
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
                      text: results[0].measure,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const builder = new XMLBuilder(options);
  const xmlContent = builder.build(clinicalDocument);
  console.log(xmlContent);
};

module.exports = {
  qrda3Export,
};
