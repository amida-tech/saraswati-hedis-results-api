const dao = require('../config/dao');

const { calculateTrend, calculateTrendLegacy } = require('../calculators/TrendCalculator');
const { calculateDailyMeasureResults } = require('../calculators/DailyResultsCalculator');

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

const getDailyMeasureResults = async (_req, res, next) => {
  try {
    const patientResults = await dao.findMembers({});

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
    if (req.query.legacyResults === 'true') {
      const results = await dao.findMeasureResults({});

      const legacyTrendData = calculateTrendLegacy(results, predictions, 7);
      return res.send(legacyTrendData);
    }
    const memberResults = await dao.findMembers({});
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
    const patientResults = await dao.findMembers(req.query);
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

module.exports = {
  getMeasureResults,
  getDailyMeasureResults,
  getTrends,
  getInfo,
  exportCsv,
  postMeasureResults,
  postInfo,
};
