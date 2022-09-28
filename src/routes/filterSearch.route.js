const express = require('express');

const router = express(); // eslint-disable-line new-cap
const { filterMembers, getDailyMeasureResults } = require('../controllers/filterSearch.controller');

if (process.env.NODE_ENV !== 'production') {
  router.post('/', filterMembers, getDailyMeasureResults, (req, res) => {
  const { submeasure, filters, isComposite } = req.body;

  const MemberResults = req.FoundMembers;

  const dailyMeasureResults = req.dailyMeasureResults ? req.dailyMeasureResults : [];

  const MemberResultsCount = req.FoundMembers.length;

  if (MemberResultsCount > 0) {
    res.status(200).json({
      status: 'Success',
      messgae: 'Members found with given search parameters',
      memberCount: MemberResults.length,
      submeasure,
      filters,
      isComposite,
      members: MemberResults,
      dailyMeasureResults,
    });
  } else {
    res.status(200).json({
      status: 'Failed',
      messgae: 'No Members found with given search parameters',
      memberCount: MemberResults.length,
      submeasure,
      filters,
      isComposite,
      members: MemberResults,
      dailyMeasureResults,
    });
  }
  });
}

module.exports = router;
