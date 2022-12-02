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

const languageCode = { '@_code': 'en' };

module.exports = {
  realmCode,
  clinicalDocumentBase,
  loincCodeSystem,
  confidentialityCode,
  languageCode,
};
