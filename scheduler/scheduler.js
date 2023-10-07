const schedule = require('node-schedule');
const User = require('../models/User'); // Import the User model or adjust the path as needed

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 0; // Sunday (adjust as needed)

// Schedule the task to reset balances every 7 days
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
