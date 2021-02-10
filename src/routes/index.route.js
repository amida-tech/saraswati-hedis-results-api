const express = require('express');
const measureRoutes = require('./measure.route');
const seedData = require('../seedData');
const db = require('../sequelize');

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'));

router.use('/measures', measureRoutes);

router.use('/seed', (async(req, res) => {
  try{
    await Promise.all(seedData.map(async (record) => await db.Measure.create(record)));
    return res.send('Database seeded');
  } catch {
    return res.send('Database has already been seeded')
  }
}));

module.exports = router;
