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
    const endDate = new Date(startDate);

    endDate.setDate(startDate.getDate() + 1);

    const activities = await Activity.find({
      activity_userID: req.params.id,
      activity_date: {
        $gte: startDate,
        $lt: endDate,
      },
      activity_status: 1,
    });

    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.get('/getWithDate/:id', verifyToken, async (req, res, next) => {
  try {
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    const activities = await Activity.find({
      activity_userID: req.params.id,
      activity_date: {
        $gte: startDate,
        $lte: endDate,
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

router.get('/weekly-activity/:userId', verifyToken, async (req, res) => {
  const userId = req.params.userId;
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

  const endOfWeek = new Date(today);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  try {
    const result = await Activity.aggregate([
      {
        $match: {
          $and: [
            { activity_userID: userId },
            { activity_date: { $gte: startOfWeek, $lte: endOfWeek } },
          ],
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: '$activity_date' },
          },
          totalDuration: { $sum: '$activity_duration' },
        },
      },
      {
        $sort: {
          '_id.day': 1,
        },
      },
    ]);

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
