const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Activity = require('../models/Activity.js');
const verifyToken = require('../middleware/verifyToken.js');

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const activities = await Activity.find().exec();
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const activities = await Activity.find({ _id: req.params.id });
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.get('/getToday/:id', verifyToken, async (req, res, next) => {
  try {
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setUTCHours(0, 0, 0, 0);
    endDate.setDate(startDate.getDate() + 1);

    console.log('startDate', startDate.toISOString());
    console.log('endDate', endDate.toISOString());

    const activities = await Activity.find({
      activity_userID: req.params.id,
      activity_date: {
        $gte: startDate,
        $lte: endDate,
      },
      activity_status: 1, // Adding the condition for activity_status
    });

    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.get('/getWithDate/:id', verifyToken, async (req, res, next) => {
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

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const activities = await Activity.create(req.body);
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(updatedActivity);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const activities = await Activity.findByIdAndDelete(req.params.id);
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
