const express = require('express');
const router = express(); // eslint-disable-line new-cap
const { filterMembers } = require("../controllers/filterSearch.controller");

router.post('/',
filterMembers,
(req, res, next) => {
  const { submeasure, filters, isComposite } = req.body;

    const MemberResults = req.FoundMembers

    const MemberResultsCount = req.FoundMembers.length
    
    if(MemberResultsCount > 0){
        res.status(200).json({
            status: 'Success',
            messgae: 'Members found with given search parameters',
            members: MemberResults,
            memberCount: MemberResults.length,
            submeasure,
            filters,
            isComposite
        });
    }else{
        res.status(200).json({
            status: 'Failed',
            messgae: 'No Members found with given search parameters',
            members: MemberResults,
            memberCount: MemberResults.length,
            submeasure,
            filters,
            isComposite
        });
    }
})

module.exports = router;