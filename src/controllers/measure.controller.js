const dao = require('../config/dao');

const { calculateTrend, calculateTrendLegacy } = require('../calculators/TrendCalculator');
const { calculateDailyMeasureResults } = require('../calculators/DailyResultsCalculator');
const { queryBuilder } = require('../utilities/filterDrawerUtils');

const { createInfoObject } = require('../utilities/infoUtil');
const { generateCsv } = require('../utilities/reportsUtil');

const getMeasureResults = async (req, res, next) => {
  try {
    const search = await dao.findMeasureResults(req.query);
    const sortedSearch = search.sort((a, b) => a.date - b.date);
    return res.send(sortedSearch);
  } catch (e) {
    return next(e);
  }
};

const getDailyMeasureResults = async (req, res, next) => {
  try {
    const measurementYear = req.query.measurementYear ? parseInt(req.query.measurementYear, 10)
      : new Date().getFullYear();
    const patientResults = await dao.findMembers({ measurementYear });

    if (patientResults.length === 0) {
      return res.send([]);
    }

    const infoList = await dao.findInfo();
    const measureInfo = createInfoObject(infoList);

    const dailyMeasureResults = calculateDailyMeasureResults(patientResults, measureInfo);
    return res.send(dailyMeasureResults);
  } catch (e) {
    return next(e);
  }
};

const getTrends = async (req, res, next) => {
  try {
    const predictions = await dao.findPredictions();
    const measurementYear = req.query.measurementYear ? parseInt(req.query.measurementYear, 10)
      : new Date().getFullYear();

    if (req.query.legacyResults === 'true') {
      const results = await dao.findMeasureResults({});

      const legacyTrendData = calculateTrendLegacy(results, predictions, 7);
      return res.send(legacyTrendData);
    }
    const memberResults = await dao.findMembers({ measurementYear });
    const infoList = await dao.findInfo();
    const measureInfo = createInfoObject(infoList);
    const trendData = calculateTrend(memberResults, measureInfo, predictions, 7);

    return res.send(trendData);
  } catch (e) {
    return next(e);
  }
};

// Compiles individual info records into one JSON object
const getInfo = async (_req, res, next) => {
  try {
    const infoList = await dao.findInfo();
    const fullInfo = createInfoObject(infoList);
    return res.send(fullInfo);
  } catch (e) {
    return next(e);
  }
};

const exportCsv = async (req, res, next) => {
  try {
    res.set({ 'Content-Disposition': 'attachment; filename=results-export.csv' });
    const xssMeasurementType = req.query.measurementType;
    const query = {
      measurementType: xssMeasurementType,
      measurementYear: parseInt(req.query.measurementYear, 10),
    };
    const patientResults = await dao.findMembers(query);
    const infoList = await dao.findInfo(xssMeasurementType);
    const measureInfo = createInfoObject(infoList);
    const csv = generateCsv(patientResults, measureInfo, xssMeasurementType);
    return res.send(csv);
  } catch (e) {
    return next(e);
  }
};

const postMeasureResults = async (req, res, next) => {
  try {
    const jsonObject = req.body;
    dao.insertMeasureResults(jsonObject);
    return res.send(jsonObject);
  } catch (e) {
    return next(e);
  }
};

const postInfo = async (req, res, next) => {
  try {
    const info = await dao.insertInfo(req.body);
    return res.send(info);
  } catch (e) {
    return next(e);
  }
};

const getFilterCriteria = async (compareOption) => {
  let filterCriteria = [];
  switch (compareOption) {
    case 'healthcareProviders':
      filterCriteria = await dao.getHealthcareProviders();
      return filterCriteria.map((value) => ({
        value: value.value, display: value.provider,
      }));
    default:
      break;
  }
  return [];
};

const compareMembers = async (req, res, next) => {
  try {
    const {
      measurementType, measurementYear, compareOption,
    } = req.body;
    // Get patient results based on measurementType and year
    const patientResults = await dao.findMembers({ measurementType, measurementYear });

    // Get information about the measures
    const infoList = await dao.findInfo();
    const measureInfo = createInfoObject(infoList);
    // Get a {display, label} list of filter criteria
    // Options are: payors, healthcareProviders, healthcareCoverages, healthcarePractitioners
    const filterCriteria = await getFilterCriteria(compareOption);

    const compiledDailyMeasureResults = [];
    // For each filter criteria
    filterCriteria.forEach((filterOption) => {
      const filteredPatients = [];
      // Find the patients that have the correct info
      patientResults.forEach((patientResult) => {
        if (compareOption === 'healthcareProviders') {
          const { providers } = patientResult;
          if (providers.find((provider) => provider.reference === filterOption.value)) {
            filteredPatients.push(patientResult);
          }
        }
      });
      // Find the results of the patient set
      const filteredResults = calculateDailyMeasureResults(filteredPatients, measureInfo);
      // Add the results to the final list
      filteredResults
        .forEach((result) => compiledDailyMeasureResults
          .push({ comparisonItem: filterOption.display, ...result }));
    });

    return res.send(compiledDailyMeasureResults);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getMeasureResults,
  getDailyMeasureResults,
  getTrends,
  getInfo,
  exportCsv,
  postMeasureResults,
  postInfo,
  compareMembers,
};
