const mongoose = require('mongoose');

const UserSchemamm = new mongoose.Schema({
    user_firstName: String,
    user_lastName: String,
    user_birthDate: Date,
    user_weight: Number,
    user_height: Number,
    user_email: String,
    user_password: String,
    user_image: String,
    user_coin: Number,
    user_status: Number,
    user_rankingID: String,
    user_rankingName: String
})

module.exports = mongoose.model('User', UserSchemamm)