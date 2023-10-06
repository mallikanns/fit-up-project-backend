const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Activity = require('../models/Activity.js');

router.get('/', async (req, res, next) => {
  try {
    const activities = await Activity.find().exec();
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const activities = await Activity.find({ activity_userID: req.params.id });
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.get('/getWithDate/:id', async (req, res, next) => {
  try {
    const startDate = new Date(req.body.startDate); // Get the start date from query parameters
    const endDate = new Date(req.body.endDate); // Get the end date from query parameters

    // Construct a custom query to find activities within the specified date range
    const activities = await Activity.find({
      activity_userID: req.params.id, // Filter by userID (assuming it's in the route parameter)
      activity_date: {
        $gte: startDate, // Greater than or equal to the start date
        $lte: endDate, // Less than or equal to the end date
      },
    });

    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const activities = await Activity.create(req.body);
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const activities = await Activity.findByIdAndDelete(req.params.id);
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
