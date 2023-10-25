const schedule = require('node-schedule');
const User = require('../models/User');

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 0;
rule.hour = 0;
rule.minute = 0;

schedule.scheduleJob(rule, async function () {
  try {
    await User.updateMany({}, { $set: { balance: 30000 } });
    console.log('Balances reset to 30000 for all users.');
  } catch (error) {
    console.error('Error resetting balances:', error);
  }
});
