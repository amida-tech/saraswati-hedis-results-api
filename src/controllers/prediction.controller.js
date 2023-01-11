/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

// Access predictions made by time series
const getPredictions = async (req, res, next) => {
  try {
    const predictions = await dao.getPredictions();
    return res.send(predictions);
  } catch (e) {
    return next(e);
  }
};

// Data time series to make predictions with
const getPredictionData = async (req, res, next) => {
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

const postPredictions = async (req, res, next) => {
  try {
    const predictions = await dao.insertPredictions(req.body);
    return res.send(predictions);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getPredictions,
  getPredictionData,
  postPredictions,
};
