function queryBuilder(submeasure, filters) {
  const payors = [];
  const healthcareProviders = [];
  const healthcareCoverages = [];
  const healthcarePractitioners = [];

  const $and = [];

  const payorsValidator = filters.payors.length > 0;
  const healthcareProvidersValidator = filters.healthcareProviders.length > 0;
  const healthcareCoveragesValidator = filters.healthcareCoverages.length > 0;
  const healthcarePractitionersValidator = filters.healthcarePractitioners.length > 0;

  if (payorsValidator) {
    filters.payors.forEach((payor) => {
      const payorsPath = 'coverage.0.payor.0.reference.value';
      payors.push({ [payorsPath]: payor });
    });
  }
  if (healthcareProvidersValidator) {
    filters.healthcareProviders.forEach((healthcareProvider) => {
      const healthcareProvidersPath = 'providers.0.display';
      healthcareProviders.push({ [healthcareProvidersPath]: healthcareProvider });
    });
  }
  if (healthcareCoveragesValidator) {
    filters.healthcareCoverages.forEach((healthcareCoverage) => {
      const healthcareCoveragesPath = 'coverage.0.type.coding.0.display.value';
      healthcareCoverages.push({ [healthcareCoveragesPath]: healthcareCoverage });
    });
  }
  if (healthcarePractitionersValidator) {
    filters.healthcarePractitioners.forEach((healthcarePractitioner) => {
      const healthcarePractitionersPath = 'providers.1.display';
      healthcarePractitioners.push({ [healthcarePractitionersPath]: healthcarePractitioner });
    });
  }

  if (payors.length > 0) {
    $and.push({ $or: payors });
  }
  if (healthcareProviders.length > 0) {
    $and.push({ $or: healthcareProviders });
  }
  if (healthcareCoverages.length > 0) {
    $and.push({ $or: healthcareCoverages });
  }
  if (healthcarePractitioners.length > 0) {
    $and.push({ $or: healthcarePractitioners });
  }

  let searchQuery = { measurementType: submeasure };

  if (submeasure === false) {
    searchQuery = {};
  }
  if ($and.length > 0) {
    searchQuery = { ...searchQuery, $and };
  }
  return {
    searchQuery,
  };
}
module.exports = {
  queryBuilder,
};
