var createError = require('http-errors');
var express = require('express');
// var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const users = require('./routes/users');
const activities = require('./routes/activities');
const cors = require('cors');
require('./scheduler/usersScheduler');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.MONGODB_URL}`
  )
  .then(() => console.log('connection successfully!'))
  .catch((err) => console.error(err));

var app = express();

app.use(
  cors({
    exposedHeaders: ['Authorization'],
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', users);
app.use('/activities', activities);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: req.app.get('env') === 'development' ? err : {},
  });
});

module.exports = app;
