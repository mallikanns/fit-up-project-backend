const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Activity = require("../models/Activity.js");
// const { route } = require("./users.js");

router.get("/", async (req, res, next) => {
  try {
    const activities = await Activity.find().exec();
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const activities = await Activity.findById(req.params.id);
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const activities = await Activity.create(req.body);
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const activities = await Activity.findByIdAndDelete(req.params.id);
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
