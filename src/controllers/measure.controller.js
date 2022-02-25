const {
  insertMeasure, insertMeasures, getMeasures, insertSimulatedHedis, insertPredictions,
  getSimulatedHedis, getPredictions, getResultData, searchMeasures, insertResults,
} = require('../config/db');

const { calcLatestNumDen } = require('../calculators/NumDenCalculator');

const { calculateTrend } = require('../calculators/TrendCalculator.js');

const logger = require('../config/winston');

const list = async (req, res, next) => {
  try {
    const measures = await getMeasures();
    // measures.forEach(measure => stringToDecimal(measure))
    return res.send(measures);
  } catch (e) {
    return next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const measure = await insertMeasure(req.body);
    return res.send(measure);
  } catch (e) {
    return next(e);
  }
};

const createBulk = async (req, res, next) => {
  try {
    const options = { ordered: true };
    const measures = await insertMeasures(req.body, options);
    return res.send(measures);
  } catch (e) {
    return next(e);
  }
};

const displayHedis = async (req, res, next) => {
  try {
    const simulations = await getSimulatedHedis();
    return res.send(simulations);
  } catch (e) {
    return next(e);
  }
};

const createSimulatedHedis = async (req, res, next) => {
  try {
    const simulations = await insertSimulatedHedis(req.body);
    return res.send(simulations);
  } catch (e) {
    return next(e);
  }
};

const displayPredictions = async (req, res, next) => {
  try {
    const predictions = await getPredictions();
    return res.send(predictions);
  } catch (e) {
    return next(e);
  }
};

const trends = async (req, res, next) => {
  try {
    const results = await getResultData({});
    const predictions = await getPredictions();

    const trendData = calculateTrend(results, predictions, 7);

    return res.send(trendData);
  } catch (e) {
    return next(e);
  }
};

const predictionData = async (req, res, next) => {
  try {
    const search = await getPredictionData(req.params);
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

const createPredictions = async (req, res, next) => {
  try {
    const predictions = await insertPredictions(req.body);
    return res.send(predictions);
  } catch (e) {
    return next(e);
  }
};

const search = async (req, res, next) => {
  try {
    const search = await searchMeasures(req.query);
    const sortedSearch = search.sort((a, b) => a.date - b.date);
    return res.send(sortedSearch);
  } catch (e) {
    return next(e);
  }
};

const calculateAndStoreResults = async (req, res, next) => {
  try {
    const search = await getMeasures();
    const valueArray = calcLatestNumDen(search);
    insertResults(valueArray);
    return res.send(valueArray);
  } catch (e) {
    return next(e);
  }
};

const storeResults = async (req, res, next) => {
  try {
    const jsonObject = req.body;
    insertResults(jsonObject);
    return res.send(jsonObject);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  list,
  create,
  createBulk,
  displayHedis,
  createSimulatedHedis,
  displayPredictions,
  predictionData,
  createPredictions,
  search,
  calculateAndStoreResults,
  storeResults,
  trends,
};
