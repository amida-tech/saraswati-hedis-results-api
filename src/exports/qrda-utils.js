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

module.exports = {
  realmCode,
  clinicalDocumentBase,
  loincCodeSystem,
  confidentialityCode,
  languageCode,
  createAuthor,
  measureSectionTemplate,
};
