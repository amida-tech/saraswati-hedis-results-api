const dao = require('../config/dao');

const { calcLatestNumDen } = require('../calculators/NumDenCalculator');

const { calculateTrend } = require('../calculators/TrendCalculator.js');

const logger = require('../config/winston');

const list = async (req, res, next) => {
  try {
    const measures = await dao.getMeasures();
    // measures.forEach(measure => stringToDecimal(measure))
    return res.send(measures);
  } catch (e) {
    return next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const measure = await dao.insertMeasure(req.body);
    return res.send(measure);
  } catch (e) {
    return next(e);
  }
};

const createBulk = async (req, res, next) => {
  try {
    const options = { ordered: true };
    const measures = await dao.insertMeasures(req.body, options);
    return res.send(measures);
  } catch (e) {
    return next(e);
  }
};

const displayHedis = async (req, res, next) => {
  try {
    const simulations = await dao.getSimulatedHedis();
    return res.send(simulations);
  } catch (e) {
    return next(e);
  }
};

const createSimulatedHedis = async (req, res, next) => {
  try {
    const simulations = await dao.insertSimulatedHedis(req.body);
    return res.send(simulations);
  } catch (e) {
    return next(e);
  }
};

const displayPredictions = async (req, res, next) => {
  try {
    const predictions = await dao.getPredictions();
    return res.send(predictions);
  } catch (e) {
    return next(e);
  }
};

const trends = async (req, res, next) => {
  try {
    const results = await dao.getMeasureResults({});
    const predictions = await dao.getPredictions();

    const trendData = calculateTrend(results, predictions, 7);

    return res.send(trendData);
  } catch (e) {
    return next(e);
  }
};

const predictionData = async (req, res, next) => {
  try {
    const search = await dao.getMeasureResults(req.params);
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
    const predictions = await dao.insertPredictions(req.body);
    return res.send(predictions);
  } catch (e) {
    return next(e);
  }
};

const searchMeasureResults = async (req, res, next) => {
  try {
    const search = await dao.getMeasureResults(req.query);
    const sortedSearch = search.sort((a, b) => a.date - b.date);
    return res.send(sortedSearch);
  } catch (e) {
    return next(e);
  }
};

const calculateAndStoreResults = async (req, res, next) => {
  try {
    const search = await dao.getMeasures();
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
    dao.insertMeasureResults(jsonObject);
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
  searchMeasureResults,
  calculateAndStoreResults,
  storeResults,
  trends,
};
