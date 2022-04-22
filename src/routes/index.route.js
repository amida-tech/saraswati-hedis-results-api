const express = require('express');
const measureRoutes = require('./measure.route');
const predictionRoutes = require('./prediction.route');

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'));

router.use('/measures', measureRoutes);
router.use('/predictions', predictionRoutes);

module.exports = router;
