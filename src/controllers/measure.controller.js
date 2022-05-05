/* eslint-disable no-underscore-dangle */
const dao = require('../config/dao');

const { calculateTrend } = require('../calculators/TrendCalculator');
const { setValue, calcLatestNumDen } = require('../calculators/NumDenCalculator');

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
  let search = await dao.findMeasures({});

  if (search.length === 0) {
    res.send([]);
  }

  const currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);
  let dailyMeasureResults = calcLatestNumDen(search, currentDate);

  let newDate = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
  search = search.filter((element) => new Date(element.timeStamp).getTime() < newDate.getTime());
  while (search.length !== 0) {
    dailyMeasureResults = dailyMeasureResults.concat(calcLatestNumDen(search, newDate));
    newDate = new Date(newDate.getTime() - (24 * 60 * 60 * 1000));
    search = search.filter((element) => new Date(element.timeStamp).getTime() < newDate.getTime());
  }

  dailyMeasureResults = dailyMeasureResults.sort((a, b) => a.date - b.date);
  res.send(dailyMeasureResults);
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
    const search = await dao.findMeasures(req.query);
    let csv = 'Member ID, Measurement, Time Stamp';
    search.forEach((result) => {
      const numeratorArray = [];
      const denominatorArray = [];
      const patientResult = result[result.memberId];
      Object.keys(patientResult).forEach((fieldName) => {
        if (fieldName.startsWith('Numerator')) {
          setValue(numeratorArray, 'Numerator', fieldName, patientResult);
        } else if (fieldName.startsWith('Denominator')) {
          setValue(denominatorArray, 'Denominator', fieldName, patientResult);
        }
      });
      let index = 0;
      while (index < numeratorArray.length) {
        if (numeratorArray[index] !== denominatorArray[index]) {
          csv += `\n${result.memberId},${result.measurementType},${result.timeStamp},`;
          break;
        }
        index += 1;
      }
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
