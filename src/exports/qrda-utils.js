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

const createDateTimeString = (date) => `${date.getFullYear()}${padZero(date.getMonth() + 1)}${padZero(date.getDate())}${padZero(date.getHours())}${padZero(date.getMinutes())}${padZero(date.getSeconds())}`;

const createAuthor = (healthcareSystemName, date) => ({
  time: { '@_value': date },
  assignedAuthor: {
    id: { '@_root': 'software_author' },
    assignedAuthoringDevice: {
      manufacturerModelName: 'Saraswati',
      softwareName: 'Saraswati',
    },
    telecom: {
      '@_use': 'WP',
      '@_value': '5558675309',
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
    statusCode: { '@_code': 'completed' },
    effectiveTime: {
      low: { '@_value': '20220101' },
      high: { '@_value': createDateString(new Date()) },
    },
  },
});

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

const createImmunoAdministeredXml = (immunization) => ({
  '@_typeCode': 'DRIV',
  substanceAdministration: {
    '@_classCode': 'SBADM',
    '@_moodCode': 'EVN',
    templateId: [
      // C-CDA R2 Immunization Activity (V3)
      { '@_root': '2.16.840.1.113883.10.20.22.4.52', '@_extension': '2015-08-01' },
      // Immunization Administered (V3)
      { '@_root': '2.16.840.1.113883.10.20.24.3.140', '@_extension': '2019-12-01' },
    ],
    id: {
      '@_root': immunization.id,
    },
    statusCode: { '@_code': 'completed' },
    effectiveTime: { '@_value': immunization.date },
    doseQuantity: { '@_value': 1 },
    consumable: {
      manufacturedProduct: {
        '@_classCode': 'MANU',
        // C-CDA R2.1 Immunization Medication Information (V2)
        templateId: { '@_root': '2.16.840.1.113883.10.20.22.4.54', '@_extension': '2014-06-09' },
        manufacturedMaterial: {
          code: {
            '@_code': immunization.code,
          },
        },
      },
    },
  },
});

const createAssessmentPerformedXml = (assessment) => ({
  '@_typeCode': 'DRIV',
  observation: {
    '@_classCode': 'OBS',
    '@_moodCode': 'EVN',
    // Assessment Performed (V3)
    templateId: { '@_root': '2.16.840.1.113883.10.20.24.3.144', '@_extension': '2019-12-01' },
    id: { '@_root': assessment.id },
    code: { '@_code': assessment.code },
    statusCode: { '@_code': 'completed' },
    effectiveTime: { '@_value': assessment.date },
    entryRelationship: {
      '@_typeCode': 'REFR',
      observation: {
        '@_classCode': 'OBS',
        '@_moodCode': 'EVN',
        templateId: { '@_root': '2.16.840.1.113883.10.20.22.4.149', '@_extension': '2017-08-01' },
        id: { '@_root': assessment.id },
        code: {
          '@_code': assessment.code,
          '@_codeSystem': '2.16.840.1.113883.6.1',
          '@_codeSystemName': 'LOINC',
        },
        value: {
          '@_xsi:type': 'INT',
          '@_value': assessment.value,
        },
      },
    },
  },
});

const createLabTestPerformedXml = (test) => ({
  '@_typeCode': 'DRIV',
  observation: {
    '@_classCode': 'OBS',
    '@_moodCode': 'EVN',
    // Laboratory Test Performed (V5)
    templateId: { '@_root': '2.16.840.1.113883.10.20.24.3.38', '@_extension': '2019-12-01' },
    id: { '@_root': test.id },
    code: { '@_code': test.code },
    statusCode: { '@_code': 'completed' },
    effectiveTime: { '@_value': test.date },
    entryRelationship: {
      '@_typeCode': 'REFR',
      observation: {
        '@_classCode': 'OBS',
        '@_moodCode': 'EVN',
        templateId: [
          { '@_root': '2.16.840.1.113883.10.20.22.4.2', '@_extension': '2015-08-01' },
          { '@_root': '2.16.840.1.113883.10.20.24.3.87', '@_extension': '2019-12-01' },
        ],
        id: { '@_root': test.id },
        statusCode: { '@_code': 'completed' },
        code: {
          '@_code': test.code,
        },
      },
    },
  },
});

const createEncounterXml = (encounter) => ({
  '@_typeCode': 'DRIV',
  act: {
    '@_classCode': 'ACT',
    '@_moodCode': 'EVN',
    templateId: {
      '@_root': '2.16.840.1.113883.10.20.24.3.133',
      '@_extension': '2019-12-01',
    },
    code: {
      '@_code': 'ENC',
      '@_codeSystem': loincCodeSystem,
      '@_displayName': 'Encounter',
      '@_codeSystemName': 'ActClass',
    },
    entryRelationship: {
      '@_typeCode': 'SUBJ',
      encounter: {
        '@_classCode': 'ENC',
        '@_moodCode': 'EVN',
        templateId: [
          // Conforms to C-CDA R2.1 Encounter Activity (V3)
          { '@_root': '2.16.840.1.113883.10.20.22.4.49', '@_extension': '2015-08-01' },
          // Encounter Performed (V5)
          { '@_root': '2.16.840.1.113883.10.20.24.3.23', '@_extension': '2019-12-01' },
        ],
        id: { '@_root': encounter.id },
        code: { '@_code': encounter.code },
        text: `Encounter: ${encounter.id}`,
        statusCode: { '@_code': 'cmopleted' },
        effectiveTime: {
          low: { '@_value': encounter.startDate },
          high: { '@_value': encounter.endDate },
        },
      },
    },
  },
});

// AAB

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

// ADD-E

const getAddePatientData = (claims, prescStartDate) => {
  const validClaims = claims.filter(
    (claim) => claim.LineItem != null
      && claim.LineItem.find((item) => {
        if (item.serviced.value) {
          return item.serviced.value.startsWith(prescStartDate);
        }
        return (item.serviced.start.value.startsWith(prescStartDate)
          || item.serviced.end.value.startsWith(prescStartDate));
      }),
  );
  return validClaims;
};

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

// AIS-E

const getAisePatientData = (memberResult) => {
  const immunizations = [];
  memberResult['Influenza Vaccine'].forEach((fluVac) => immunizations.push(fluVac));
  memberResult['Td or Tdap Vaccine'].forEach((tdapVac) => immunizations.push(tdapVac));
  memberResult['Herpes Zoster Live Vaccine'].forEach((herpVac) => immunizations.push(herpVac));
  memberResult['Herpes Zoster Recombinant Vaccine'].forEach((herpVac) => immunizations.push(herpVac));
  memberResult['Pneumococcal Polysaccharide Vaccine 23'].forEach((pneumVac) => immunizations.push(pneumVac));
  const immunoInfoList = [];
  immunizations.forEach((immuno) => {
    const immunoInfo = { id: immuno.id.value, date: '', code: '' };
    if (immuno.code) {
      immunoInfo.code = immuno.code.coding[0].code.value;
    } else if (immuno.vaccineCode) {
      immunoInfo.code = immuno.vaccineCode.coding[0].code.value;
    }

    if (immuno.performed) {
      immunoInfo.date = createDateTimeString(new Date(immuno.performed.value));
    } else if (immuno.occurrence) {
      immunoInfo.date = createDateTimeString(new Date(immuno.occurrence.value));
    }

    immunoInfoList.push(immunoInfo);
  });
  return immunoInfoList;
};

const handleAisePatientData = (member) => getAisePatientData(member.result)
  .map((immunization) => createImmunoAdministeredXml(immunization));

// APM-E is skipped
// ASF-E

const getAsfePatientData = (memberResult) => {
  const documentedResults = [];
  memberResult['AUDIT Screen with Documented Result'].forEach((audit) => documentedResults.push(audit));
  memberResult['AUDIT-C Screen with Documented Result'].forEach((auditC) => documentedResults.push(auditC));
  memberResult['Single-Question Screen with Documented Result'].forEach((sQuest) => documentedResults.push(sQuest));
  const docResultList = [];
  documentedResults.forEach((result) => {
    const immunoInfo = {
      id: result.id.value,
      date: createDateTimeString(new Date(result.effective.value)),
      code: result.code.coding[0].code.value,
      value: result.value.value,
    };

    docResultList.push(immunoInfo);
  });
  return docResultList;
};

const handleAsfePatientData = (member) => getAsfePatientData(member.result)
  .map((immunization) => createAssessmentPerformedXml(immunization));

// BCS-E skipped
// CCS

const getCcsPatientData = (memberResult) => {
  const documentedResults = [];
  memberResult['Cervical Cytology Within 3 Years'].forEach((cervical) => documentedResults.push(cervical));
  memberResult['hrHPV Testing Within 5 Years'].forEach((hrHPV) => documentedResults.push(hrHPV));
  const docResultList = [];
  documentedResults.forEach((result) => {
    const immunoInfo = {
      id: result.id.value,
      date: createDateTimeString(new Date(result.effective.value)),
      code: result.code.coding[0].code.value,
    };

    docResultList.push(immunoInfo);
  });
  return docResultList;
};

const handleCcsPatientData = (member) => getCcsPatientData(member.result)
  .map((immunization) => createLabTestPerformedXml(immunization));

// CIS-E

const getCisePatientData = (memberResult) => {
  const documentedResults = [];
  memberResult['DTaP Vaccinations'].forEach((dtap) => documentedResults.push(dtap));
  memberResult['IPV Vaccinations'].forEach((ipv) => documentedResults.push(ipv));
  memberResult['MMR Vaccinations'].forEach((mmr) => documentedResults.push(mmr));
  memberResult['HiB Vaccinations'].forEach((hib) => documentedResults.push(hib));
  memberResult['HepB Vaccinations'].forEach((hepB) => documentedResults.push(hepB));
  memberResult['Newborn HepB Vaccinations'].forEach((hrHPV) => documentedResults.push(hrHPV));
  memberResult['VZV Vaccinations'].forEach((newHepB) => documentedResults.push(newHepB));
  memberResult['PCV Vaccinations'].forEach((pcv) => documentedResults.push(pcv));
  memberResult['HepA Vaccinations'].forEach((hepA) => documentedResults.push(hepA));
  memberResult['RV 2 Dose Vaccinations'].forEach((rv2) => documentedResults.push(rv2));
  memberResult['RV 3 Dose Vaccinations'].forEach((rv3) => documentedResults.push(rv3));
  memberResult['Influenza Vaccinations'].forEach((flu) => documentedResults.push(flu));
  memberResult['LAIV Vaccinations'].forEach((laiv) => documentedResults.push(laiv));
  const docResultList = [];
  documentedResults.forEach((result) => {
    const immunoInfo = {
      id: result.id.value,
      date: '',
      code: '',
    };

    if (result.performed) {
      immunoInfo.date = createDateTimeString(new Date(result.performed.value));
    } else if (result.occurrence) {
      immunoInfo.date = createDateTimeString(new Date(result.occurrence.value));
    }

    if (result.code) {
      immunoInfo.code = result.code.coding[0].code.value;
    } else if (result.vaccineCode) {
      immunoInfo.code = result.vaccineCode.coding[0].code.value;
    }

    docResultList.push(immunoInfo);
  });
  return docResultList;
};

const handleCisePatientData = (member) => getCisePatientData(member.result)
  .map((immunization) => createImmunoAdministeredXml(immunization));

// COL-E

const getColePatientData = (memberResult) => {
  const documentedResults = [];
  memberResult['Fecal Occult Blood Test Performed'].forEach((fobtp) => documentedResults.push(fobtp));
  memberResult['Flexible Sigmoidoscopy Performed'].forEach((fsp) => documentedResults.push(fsp));
  memberResult['Colonoscopy Performed'].forEach((cp) => documentedResults.push(cp));
  memberResult['CT Colonography Performed'].forEach((ctcp) => documentedResults.push(ctcp));
  memberResult['Fecal Immunochemical Test DNA Performed'].forEach((fitdp) => documentedResults.push(fitdp));
  const docResultList = [];
  documentedResults.forEach((result) => {
    const testInfo = {
      id: result.id.value,
      date: '',
      code: result.code.coding[0].code.value,
    };

    if (result.effective && result.effective.value) {
      testInfo.date = createDateTimeString(new Date(result.effective.value));
    } else if (result.performed) {
      testInfo.date = createDateTimeString(new Date(result.performed.value));
    } else if (result.effective && result.effective.start) {
      testInfo.date = createDateTimeString(new Date(result.effective.start.value));
    }

    docResultList.push(testInfo);
  });
  return docResultList;
};

const handleColePatientData = (member) => getColePatientData(member.result)
  .map((immunization) => createLabTestPerformedXml(immunization));

// CWP

const getCwpPatientData = (claims, episodeDates) => {
  const validClaims = claims.filter(
    (claim) => claim.item != null && claim.procedure !== null
      && claim.item.find((item) => {
        if (item.serviced.value) {
          return episodeDates.find((episodeDate) => item.serviced.value.startsWith(episodeDate));
        }
        return episodeDates.find((episodeDate) => item.serviced.start.value.startsWith(episodeDate))
          || episodeDates.find((episodeDate) => item.serviced.end.value.startsWith(episodeDate));
      }),
  );
  return validClaims;
};

const handleCwpPatientData = (member) => {
  const claims = getCwpPatientData(member.result['Member Claims'], member.support['Certification Episode Date']);
  const productInfo = [];
  claims.forEach((claim) => claim.item
    .forEach((item, itemIndex) => item.revenue.coding
      .forEach((coding, codeIndex) => productInfo
        .push({
          id: `${claim.id.value}-${itemIndex}-${codeIndex}`,
          code: coding.code.value,
        }))));
  return productInfo.map((claim) => createProcedureXml(claim));
};

// DMSE

const getDmsePatientData = (memberResult) => {
  const docResultList = [];
  memberResult['Interactive Outpatient Encounter With A Diagnosis Of Major Depression Or Dysthymia'].forEach((result) => {
    const immunoInfo = {
      id: result.id.value,
      startDate: createDateTimeString(new Date(result.period.start.value)),
      endDate: createDateTimeString(new Date(result.period.end.value)),
      code: result.type[0].coding[0].code.value,
    };

    docResultList.push(immunoInfo);
  });
  return docResultList;
};

const handleDmsePatientData = (member) => getDmsePatientData(member.result)
  .map((encounter) => createEncounterXml(encounter));

// DRR-E

const getDrrePatientData = (memberResult) => {
  const docResultList = [];
  memberResult['PHQ-9 Assessments'].forEach((result) => {
    const assessmentInfo = {
      id: result.id.value,
      date: createDateTimeString(new Date(result.effective.start.value)),
      code: result.code.coding[0].code.value,
      value: result.value.value,
    };

    docResultList.push(assessmentInfo);
  });
  return docResultList;
};

const handleDrrePatientData = (member) => getDrrePatientData(member.result)
  .map((encounter) => createAssessmentPerformedXml(encounter));

// DSF-E

const getDsfePatientData = (memberResult) => {
  const documentedResults = [];
  memberResult['Adult Full Length Depression Screen with Documented Result'].forEach((audit) => documentedResults.push(audit));
  memberResult['Adult Brief Screen with Documented Result'].forEach((auditC) => documentedResults.push(auditC));
  memberResult['Adolescent Full Length Depression Screen with Documented Result'].forEach((audit) => documentedResults.push(audit));
  memberResult['Adolescent Brief Screen with Documented Result'].forEach((auditC) => documentedResults.push(auditC));
  const docResultList = [];
  documentedResults.forEach((result) => {
    const immunoInfo = {
      id: result.id.value,
      date: createDateTimeString(new Date(result.effective.start.value)),
      code: result.code.coding[0].code.value,
      value: result.value.value,
    };

    docResultList.push(immunoInfo);
  });
  return docResultList;
};

const handleDsfePatientData = (member) => getDsfePatientData(member.result)
  .map((immunization) => createAssessmentPerformedXml(immunization));

// FUM

const getFumPatientData = (claims, qualifyingEpisodes) => {
  const validClaims = claims.filter(
    (claim) => (claim.procedure != null && claim.item != null)
      && claim.item.find((item) => {
      // eslint-disable-next-line no-restricted-syntax
        for (const episodeDate of qualifyingEpisodes) {
          if (item.serviced.value) {
            return item.serviced.value.startsWith(episodeDate.date);
          }
          if (item.serviced.start.value.startsWith(episodeDate.date)
          || item.serviced.end.value.startsWith(episodeDate.date)) {
            return true;
          }
        }
        return false;
      }),
  );
  return validClaims;
};

const handleFumPatientData = (member) => {
  const claims = getFumPatientData(member.result['Member Claims'], member.support['Certification Info']);
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

// IMA-E

const getImaePatientData = (memberResult) => {
  const immunizations = [];
  memberResult['Meningococcal Vaccinations'].forEach((fluVac) => immunizations.push(fluVac));
  memberResult['Tdap Vaccinations'].forEach((tdapVac) => immunizations.push(tdapVac));
  memberResult['HPV Vaccinations'].forEach((herpVac) => immunizations.push(herpVac));
  const immunoInfoList = [];
  immunizations.forEach((immuno) => {
    const immunoInfo = { id: immuno.id.value, date: '', code: '' };
    if (immuno.code) {
      immunoInfo.code = immuno.code.coding[0].code.value;
    } else if (immuno.vaccineCode) {
      immunoInfo.code = immuno.vaccineCode.coding[0].code.value;
    }

    if (immuno.performed) {
      immunoInfo.date = createDateTimeString(new Date(immuno.performed.value));
    } else if (immuno.occurrence) {
      immunoInfo.date = createDateTimeString(new Date(immuno.occurrence.value));
    }

    immunoInfoList.push(immunoInfo);
  });
  return immunoInfoList;
};

const handleImaePatientData = (member) => getImaePatientData(member.result)
  .map((immunization) => createImmunoAdministeredXml(immunization));

// PDS-E
// PND-E
// PRS-E

const getDeliveriesPatientData = (memberResult) => {
  const docResultList = [];
  memberResult.support['Certification Delivery'].forEach((result) => {
    const assessmentInfo = {
      id: result.deliveries.id.value,
      date: createDateTimeString(new Date(result.deliveryDate)),
      code: result.deliveries.code.coding[0].code.value,
    };

    docResultList.push(assessmentInfo);
  });
  return docResultList;
};

const handleDeliveriesPatientData = (member) => getDeliveriesPatientData(member)
  .map((encounter) => createProcedureXml(encounter));

// URI

const getUriPatientData = (claims, episodeDates) => {
  const validClaims = claims.filter(
    (claim) => claim.item != null && claim.procedure !== null
      && claim.item.find((item) => {
        if (item.serviced.value) {
          return episodeDates.find((episodeDate) => item.serviced.value
            .startsWith(episodeDate.date));
        }
        return episodeDates.find((episodeDate) => item.serviced.start.value
          .startsWith(episodeDate.date))
          || episodeDates.find((episodeDate) => item.serviced.end.value
            .startsWith(episodeDate.date));
      }),
  );
  return validClaims;
};

const handleUriPatientData = (member) => {
  const claims = getUriPatientData(member.result['Member Claims'], member.support['Certification Info']);
  const productInfo = [];
  claims.forEach((claim) => claim.item
    .forEach((item, itemIndex) => item.revenue.coding
      .forEach((coding, codeIndex) => productInfo
        .push({
          id: `${claim.id.value}-${itemIndex}-${codeIndex}`,
          code: coding.code.value,
        }))));
  return productInfo.map((claim) => createProcedureXml(claim));
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
  handleAisePatientData,
  handleAsfePatientData,
  handleCcsPatientData,
  handleCisePatientData,
  handleColePatientData,
  handleCwpPatientData,
  handleDmsePatientData,
  handleDrrePatientData,
  handleDsfePatientData,
  handleFumPatientData,
  handleImaePatientData,
  handleDeliveriesPatientData,
  handleUriPatientData,
  createDateString,
  createDateTimeString,
};
