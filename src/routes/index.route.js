const express = require('express');
const measureRoutes = require('./measure.route');
const seedData = require('../config/seedData');
const db = require('../config/sequelize');
const config = require('../config/config');

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'));

router.use('/measures', measureRoutes);

router.use('/seed', (async (req, res) => {
  if (config.env === 'production') {
    return res.send('seeding only available in development');
  } else {
    try {
      await Promise.all(seedData.map((record) => db.Measure.create(record)));
      return res.send('Database seeded');
    } catch {
      return res.send('Database has already been seeded');
    }
  }
}));

module.exports = router;
