/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

const { calculateTrend } = require('../calculators/TrendCalculator');

const getMeasures = async (req, res, next) => {
  try {
    const measures = await dao.findMeasures();
    // measures.forEach(measure => stringToDecimal(measure))
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

const getTrends = async (req, res, next) => {
  try {
    const results = await dao.findMeasureResults({});
    const predictions = await dao.findPredictions();

    const trendData = calculateTrend(results, predictions, 7);

    return res.send(trendData);
  } catch (e) {
    return next(e);
  }
};

// Access predictions made by time series
const getPredictions = async (req, res, next) => {
  try {
    const predictions = await dao.findPredictions();
    return res.send(predictions);
  } catch (e) {
    return next(e);
  }
};

// Data time series to make predictions with
const getPredictionData = async (req, res, next) => {
  try {
    const search = await dao.findMeasureResults(req.params);
    const predictionData = search.sort((a, b) => a.date - b.date);
    const compiledData = {
      _id: req.params.measure,
      DATE: {},
      HEDIS0: {},
    };
    for (let i = 0; i < predictionData.length; i += 1) {
      const result = predictionData[i];
      compiledData.DATE[i.toString()] = new Date(result.date).getTime();
      compiledData.HEDIS0[i.toString()] = result.value;
    }
    return res.send([compiledData]);
  } catch (e) {
    return next(e);
  }
};

// Compiles individual info records into one JSON object
const getInfo = async (req, res, next) => {
  try {
    const infoList = await dao.findInfo();
    const fullInfo = {};
    for (let i = 0; i < infoList.length; i += 1) {
      const info = infoList[i];
      fullInfo[info._id] = info[info._id];
    }
    return res.send(fullInfo);
  } catch (e) {
    return next(e);
  }
};

const exportCsv = async (req, res, next) => {
  try {
    res.set({ 'Content-Disposition': 'attachment; filename=results-export.csv' });
    const search = await dao.findMeasures();
    let csv = 'Member ID, Measurement, Time Stamp';
    search.forEach((result) => {
      const patientResult = result[result.memberId];
      Object.entries(patientResult).forEach(([key, entry]) => {
        console.log(key);
      });
      csv += `\n${result.memberId},${result.measurementType},${result.timeStamp},`;
    });
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

const postPredictions = async (req, res, next) => {
  try {
    const predictions = await dao.insertPredictions(req.body);
    return res.send(predictions);
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
  getTrends,
  getPredictions,
  getPredictionData,
  getInfo,
  exportCsv,
  postBulkMeasures,
  postMeasure,
  postMeasureResults,
  postPredictions,
  postInfo,
};
