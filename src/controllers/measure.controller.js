/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

const { calculateTrend, calculateTrendLegacy } = require('../calculators/TrendCalculator');
const { calculateDailyMeasureResults } = require('../calculators/DailyResultsCalculator');

const { createInfoObject } = require('../utilities/infoUtil');
const { generateCsv } = require('../utilities/reportsUtil');

const getMeasureResults = async (req, res, next) => {
  try {
    const search = await dao.getMeasureResults(req.query);
    const sortedSearch = search.sort((a, b) => a.date - b.date);
    return res.send(sortedSearch);
  } catch (e) {
    return next(e);
  }
};

const getDailyMeasureResults = async (_req, res, next) => {
  try {
    const patientResults = await dao.getMembers({});

    if (patientResults.length === 0) {
      return res.send([]);
    }

    const infoList = await dao.getInfo();
    const measureInfo = createInfoObject(infoList);

    const dailyMeasureResults = calculateDailyMeasureResults(patientResults, measureInfo);
    return res.send(dailyMeasureResults);
  } catch (e) {
    return next(e);
  }
};

const getTrends = async (req, res, next) => {
  try {
    const predictions = await dao.getPredictions();
    if (req.query.legacyResults === 'true') {
      const results = await dao.getMeasureResults({});

      const legacyTrendData = calculateTrendLegacy(results, predictions, 7);
      return res.send(legacyTrendData);
    }
    const memberResults = await dao.getMembers({});
    const infoList = await dao.getInfo();
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
    const infoList = await dao.getInfo();
    const fullInfo = createInfoObject(infoList);
    return res.send(fullInfo);
  } catch (e) {
    return next(e);
  }
};

const exportCsv = async (req, res, next) => {
  try {
    res.set({ 'Content-Disposition': 'attachment; filename=results-export.csv' });
    const patientResults = await dao.getMembers(req.query);
    const infoList = await dao.getInfo(req.query.measurementType);
    const measureInfo = createInfoObject(infoList);
    const csv = generateCsv(patientResults, measureInfo, req.query.measurementType);
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
