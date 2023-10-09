var createError = require('http-errors');
var express = require('express');
// var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const users = require('./routes/users');
const activities = require('./routes/activities');
const cors = require('cors'); // Import the 'cors' middleware
require('./scheduler/usersScheduler');

mongoose.Promise = global.Promise;
mongoose
  .connect(
    'mongodb+srv://admin:admin@cluster0.aqrmna5.mongodb.net/fit-up-project'
  )
  .then(() => console.log('connection successfully!'))
  .catch((err) => console.error(err));

var app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable CORS credentials if needed (cookies, authentication, etc.)
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users', users);
app.use('/activities', activities);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send a JSON response with the error details
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: req.app.get('env') === 'development' ? err : {},
  });
});

module.exports = app;
