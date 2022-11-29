const express = require('express');
const measureRoutes = require('./measure.route');
const filterRoutes = require('./filterSearch.route');
const predictionRoutes = require('./prediction.route');
const memberRoutes = require('./member.route');
const exportRoutes = require('./export.route');
const payorsRoutes = require('./payors.route');
const providersRoutes = require('./healthcareProviders.route');
const coverageRoutes = require('./healthcareCoverages.route');
const practitionerRoutes = require('./practitioners.route');
// User Routes - (Login, User Details)
const adminRoutes = require('./admin.route');
const userProfileRoutes = require('./profile.route');

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'));

router.use('/filter', filterRoutes);
router.use('/measures', measureRoutes);
router.use('/members', memberRoutes);
router.use('/predictions', predictionRoutes);
router.use('/exports', exportRoutes);
router.use('/payors', payorsRoutes);
router.use('/healthcareproviders', providersRoutes);
router.use('/healthcarecoverages', coverageRoutes);
router.use('/practitioners', practitionerRoutes);
router.use('/admin', adminRoutes);
router.use('/user/profile', userProfileRoutes);

module.exports = router;
