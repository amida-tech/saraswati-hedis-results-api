const dao = require('../config/dao');
const { queryBuilder } = require('../utilities/filterDrawerUtils');
const { calculateDailyMeasureResults } = require('../calculators/DailyResultsCalculator');
const { createInfoObject } = require('../utilities/infoUtil');

const filterMembers = async (req, res, next) => {
  const { submeasure, filters } = req.body;
  const { searchQuery } = queryBuilder(submeasure, filters);

  try {
    const Members = await dao.findMembers(searchQuery);
    req.FoundMembers = Members;
    next();
  } catch (error) {
    next(error);
  }
};

const getDailyMeasureResults = async (req, res, next) => {
  try {
    const patientResults = req.FoundMembers;

    if (patientResults.length === 0) {
      return res.send([]);
    }

    const infoList = await dao.findInfo();
    const measureInfo = createInfoObject(infoList);
    const dailyMeasureResults = calculateDailyMeasureResults(patientResults, measureInfo);
    req.dailyMeasureResults = dailyMeasureResults;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  filterMembers,
  getDailyMeasureResults,
};