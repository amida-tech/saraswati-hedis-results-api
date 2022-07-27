const express = require('express');
const router = express(); // eslint-disable-line new-cap
const { filterMembers, filterMembersDBStyle } = require("../controllers/filterSearch.controller");

router.post('/', filterMembersDBStyle, (req, res, next) => {
    const { submeasure, filters, isComposite } = req.body;

    const MemberResults = req.FoundMembers;

    const MemberResultsCount = req.FoundMembers.length;
    
    if(MemberResultsCount > 0){
        res.status(200).json({
            status: 'Success',
            messgae: 'Members found with given search parameters',
            memberCount: MemberResults.length,
            submeasure,
            filters,
            isComposite,
            members: MemberResults,
        });
    }else{
        res.status(200).json({
            status: 'Failed',
            messgae: 'No Members found with given search parameters',
            memberCount: MemberResults.length,
            submeasure,
            filters,
            isComposite,
            members: MemberResults,
        });
    }
})

module.exports = router;