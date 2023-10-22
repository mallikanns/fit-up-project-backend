const schedule = require('node-schedule');
const User = require('../models/User'); // Import the User model or adjust the path as needed

// Set the rule to trigger the job every Sunday at midnight
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 0; // Sunday
rule.hour = 0; // 0 AM
rule.minute = 0; // 0 minutes

// Schedule the task
schedule.scheduleJob(rule, async function () {
  try {
    // Find all users and update their balances to 30000
    await User.updateMany({}, { $set: { balance: 30000 } });
    console.log('Balances reset to 30000 for all users.');
  } catch (error) {
    console.error('Error resetting balances:', error);
  }
});

// // Define a rule to run the task every minute
// const rule = new schedule.RecurrenceRule();
// rule.second = 0; // Run at the start of each minute (adjust as needed)

// // Schedule the task to reset balances every minute for testing
// schedule.scheduleJob(rule, async function () {
//   try {
//     // Find all users and update their balances to 30000
//     await User.updateMany({}, { $set: { balance: 30000 } });
//     console.log('Balances reset to 30000 for all users.');
//   } catch (error) {
//     console.error('Error resetting balances:', error);
//   }
// });
