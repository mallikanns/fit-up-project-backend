const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    activity_userID: String, 
    activity_name: String, 
    activity_desc: String, 
    activity_duration: Number, 
    activity_date: Date, 
    activity_image: String, 
    activity_status: Number, 
})

module.exports = mongoose.model('Activity', ActivitySchema)