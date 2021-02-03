const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../param-validation');
const measureCtrl = require('../controllers/measure.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(measureCtrl.list)
  .post(measureCtrl.create)
  //.post(validate(paramValidation.createMeasure), measureCtrl.create)

router.route('/:id')
  .get(measureCtrl.get)
  .put(measureCtrl.update)
  //.put(validate(paramValidation.updateMeasure), measureCtrl.update)
  .delete(measureCtrl.remove)


module.exports = router;
