/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

const { calculateTrend, calculateTrendLegacy } = require('../calculators/TrendCalculator');
const { calculateDailyMeasureResults } = require('../calculators/DailyResultsCalculator');

const { createInfoObject } = require('../utilities/infoUtil');
const { generateCsv } = require('../utilities/reportsUtil');

const getMeasures = async (req, res, next) => {
  try {
    const measures = await dao.findMeasures({});
    return res.send(measures);
  } catch (e) {
    return next(e);
  }
};

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
    const patientResults = await dao.findMeasures({});

    if (patientResults.length === 0) {
      res.send([]);
    }

    const infoList = await dao.findInfo();
    const measureInfo = createInfoObject(infoList);

    const dailyMeasureResults = calculateDailyMeasureResults(patientResults, measureInfo);
    res.send(dailyMeasureResults);
  } catch (e) {
    next(e);
  }
};

const getTrends = async (req, res, next) => {
  try {
    const predictions = await dao.findPredictions();
    if (req.query.legacyResults === 'true') {
      const results = await dao.findMeasureResults({});

      const trendData = calculateTrendLegacy(results, predictions, 7);
      return res.send(trendData);
    }
    const memberResults = await dao.findMeasures({});
    const infoList = await dao.findInfo();
    const measureInfo = createInfoObject(infoList);
    const trendData = calculateTrend(memberResults, measureInfo, predictions, 7);
    return res.send(trendData);
  } catch (e) {
    return next(e);
  }
};

// Compiles individual info records into one JSON object
const getInfo = async (req, res, next) => {
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
    const patientResults = await dao.findMeasures(req.query);
    const infoList = await dao.findInfo(req.query.measurementType);
    const measureInfo = createInfoObject(infoList);
    const csv = generateCsv(patientResults, measureInfo, req.query.measurementType);
    res.send(csv);
  } catch (e) {
    next(e);
  }
};

const postBulkMeasures = async (req, res, next) => {
  try {
    const options = { ordered: true };
    const measures = await dao.insertMeasures(req.body, options);
    return res.send(measures);
  } catch (e) {
    return next(e);
  }
};

const postMeasure = async (req, res, next) => {
  try {
    const measure = await dao.insertMeasure(req.body);
    return res.send(measure);
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
  getMeasures,
  getMeasureResults,
  getDailyMeasureResults,
  getTrends,
  getInfo,
  exportCsv,
  postBulkMeasures,
  postMeasure,
  postMeasureResults,
  postInfo,
};
