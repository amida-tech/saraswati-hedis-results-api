const {
  insertMeasure, insertMeasures, getMeasures, insertSimulatedHedis,
  insertPredictions, getSimulatedHedis, getPredictions, searchMeasures, insertResults
} = require('../config/db');

const { calcLatestNumDen } = require('../calculators/NumDenCalculator');

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
    return res.send(search);
  } catch (e) {
    return next(e);
  }
}

const calculateAndStoreResults = async (req, res, next) => {
  try {
    const search = await searchMeasures();
    const valueArray = calcLatestNumDen(search);
    insertResults(valueArray);
    return res.send(valueArray);
  } catch (e) {
    return next(e);
  }
}

const storeResults = async (req, res, next) => {
  try {
    const jsonObject = req.body;
    insertResults(jsonObject);
    return res.send(jsonObject);
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  list,
  create,
  createBulk,
  displayHedis,
  createSimulatedHedis,
  displayPredictions,
  createPredictions,
  search,
  calculateAndStoreResults,
  storeResults
};
