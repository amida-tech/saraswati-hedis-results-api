const express = require('express');
const { getRecommendations } = require('../controllers/recommendations.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.post('/', getRecommendations, (req, res, next) => {
    if (req.recommendations.length > 0){
        res.status(200).json({
            status: "Success",
            recommendations: req.recommendations ,
        })
    } else {
        res.status(200).json({
            status: "Failed",
            recommendations: req.recommendations ,
        })
    }
})

module.exports = router;
