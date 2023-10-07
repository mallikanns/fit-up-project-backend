const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchemamm = new mongoose.Schema({
  user_firstName: {
    type: String,
    required: true,
  },
  user_lastName: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        // Regular expression to check if it's a valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: 'Invalid email format',
    },
  },
  user_username: {
    type: String,
    required: true,
    minlength: 6,
    match: /^[A-Za-z0-9_]+$/, // Allows letters, numbers, and underscores
    unique: true,
    //immutable: true, // This makes the field read-only after initial creation
  },
  updates: {
    type: Number,
    default: 0,
  },
  lastUpdateTimestamp: {
    type: Date,
  },
  user_password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value) {
        // Check for at least one uppercase letter and one number
        return /[A-Z]+/.test(value) && /\d+/.test(value);
      },
      message:
        'Password must contain at least one uppercase letter and one number',
    },
  },
  user_birthDate: {
    type: Date,
    required: true,
  },
  user_Gender: {
    type: String,
    required: true,
  },
  user_weight: {
    type: Number,
    required: true,
  },
  user_height: {
    type: Number,
    required: true,
  },
  user_coin: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 30000,
  },
  user_status: {
    type: Number,
    default: 1,
  },
  user_rankingName: {
    type: String,
    default: 'beginner',
  },
  user_image: String,
});

UserSchemamm.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(this.user_password, salt);
    this.user_password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchemamm.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate(); // Get the update object
    if (update.user_password) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(update.user_password, salt);
      update.user_password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchemamm.pre('save', async function (next) {
  if (!this.isModified('user_username')) {
    return next();
  }

  if (this.updates === 0 && this.lastUpdateTimestamp === undefined) {
    // First update, or no previous update
    this.updates = 1;
  } else if (this.updates === 1) {
    this.updates = 0;
    this.lastUpdateTimestamp = new Date();
    return next();
  } else {
    // Check if it's been 7 days since the last update
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (this.lastUpdateTimestamp > sevenDaysAgo) {
      throw new Error(
        'Username update is restricted within 7 days of the last update.'
      );
    }

    // Reset the cooldown period
    this.updates = 0;
  }

  this.lastUpdateTimestamp = new Date();
  next();
});

module.exports = mongoose.model('User', UserSchemamm);
