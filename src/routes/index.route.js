const express = require('express');
const package = require('../../package.json');
const dummyData = require('../dummyData.json')

const router = express.Router(); // eslint-disable-line new-cap
const version = package.version.split('.').shift();
const baseURL = `/v${version}`;

router.get('/health', (req, res) => {
  res.send('OK')
});


router.get(`${baseURL}/measures/`, (req, res) => res.send(dummyData));

router.get(`${baseURL}/measures/:measure`, (req, res) => {
  const measureData = dummyData.find(measure => measure.id === req.params.measure);
  if (!measureData){
    res.status(404).send("measure doesn't exist");
  } else {
    res.send(measureData)
  }
});

router.post(`${baseURL}/measures/:measure`, (req, res) => {
  // save data to a database
});

module.exports = router;
