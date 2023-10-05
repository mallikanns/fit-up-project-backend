const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.js");

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const users = await User.findById(req.params.id);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const users = await User.create(req.body);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
