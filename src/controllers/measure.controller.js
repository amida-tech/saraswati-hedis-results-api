/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

const { calculateTrend, calculateTrendLegacy } = require('../calculators/TrendCalculator');
const { calcLatestNumDen } = require('../calculators/NumDenCalculator');

const dayMiliseconds = 86400000;
const eodMiliseconds = 84960000;
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
    let search = await dao.findMembers({});

    if (search.length === 0) {
      res.send([]);
    }

    const currentDate = new Date();
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);
    let dailyMeasureResults = calcLatestNumDen(search, currentDate);

    // Set the day to 5/5/2022, but compare the times against 5/5/2022 11:59:59 PM
    let newDate = new Date(currentDate.getTime() - dayMiliseconds);
    search = search.filter(
      (element) => new Date(element.timeStamp).getTime() < (newDate.getTime() + eodMiliseconds),
    );
    while (search.length !== 0) {
      dailyMeasureResults = dailyMeasureResults.concat(calcLatestNumDen(search, newDate));
      newDate = new Date(newDate.getTime() - dayMiliseconds);
      const compareDateTime = newDate.getTime() + eodMiliseconds;
      search = search.filter((element) => new Date(element.timeStamp).getTime() < compareDateTime);
    }

    dailyMeasureResults = dailyMeasureResults.sort((a, b) => a.date - b.date);
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
    const memberResults = await dao.findMembers({});
    const trendData = calculateTrend(memberResults, predictions, 7);
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
    const patientResults = await dao.findMembers(req.query);
    const infoList = await dao.findInfo(req.query.measurementType);
    const measureInfo = createInfoObject(infoList);
    const csv = generateCsv(patientResults, measureInfo, req.query.measurementType);
    res.send(csv);
  } catch (e) {
    next(e);
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
