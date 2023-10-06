const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  activity_userID: {
    type: String,
    required: true,
  },
  activity_type: {
    type: String,
    required: true,
  },
  activity_name: {
    type: String,
    required: true,
  },
  activity_desc: String, // This field is optional
  activity_duration: {
    type: Number,
    required: true,
  },
  activity_date: {
    type: Date,
    required: true,
  },
  activity_status: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model('Activity', ActivitySchema);
