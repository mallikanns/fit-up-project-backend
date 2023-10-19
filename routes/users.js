const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path'); // Import the 'path' module
const mongoose = require('mongoose');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken.js');

//get users all
router.get('/', async (req, res, next) => {
  try {
    // const users = await User.find().select('-user_password').exec();
    const users = await User.find();

    if (!users) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET a single user's data, including their profile image
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-user_password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

//create user
router.post('/', async (req, res, next) => {
  try {
    const { user_username } = req.body;

    const user = await User.findOne({ user_username }).select('-user_password');

    if (user) {
      return res.status(404).json({ message: 'Username is already used' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.user_password, salt);

    req.body.user_password = hashedPassword;

    const newUser = new User({
      ...req.body,
    });

    // Save the user to the database
    await newUser.save();

    res.json(newUser);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user doesn't exist, return an error response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isChangePassword = await bcrypt.compare(
      updatedData.user_password,
      user.user_password
    );

    if (!isChangePassword) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(updatedData.user_password, salt);
      updatedData.user_password = hashedPassword;
    }

    // Update the user's data with the provided updates
    user.set(updatedData);

    // Validate the user document
    const validationError = user.validateSync();

    if (validationError) {
      // If there are validation errors, return an error response
      return res.status(400).json({
        message: 'Validation error',
        errors: validationError.errors,
      });
    }

    // Save the updated user document
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// router.post('/login', async (req, res, next) => {
//   const { user_username, user_password } = req.body;

//   try {
//     // Find the user by username
//     const user = await User.findOne({ user_username });

//     // If no user is found, send an error
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Compare the provided password with the hashed password in the database
//     const isPasswordValid = await bcrypt.compare(
//       user_password,
//       user.user_password
//     );

//     // If passwords don't match, send an error
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // If everything is valid, send the user information as a response
//     res.json({ message: 'Login successful', user });
//   } catch (err) {
//     next(err);
//   }
// });

router.post('/login', async (req, res, next) => {
  const { user_email, user_password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ user_email });

    // If no user is found, send an error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      user_password,
      user.user_password
    );

    // If passwords don't match, send an error
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Construct the payload for the JWT token
    const payload = {
      _id: user._id,
      firstname: user.user_firstName,
      lastname: user.user_lastName,
      username: user.user_username,
      email: user.user_email,
    };

    // Generate a JWT token with the custom payload
    const token = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '1h', // Token will expire in 1 hour
    });

    // Set the token in the response header
    res.setHeader('Authorization', `Bearer ${token}`);

    // Return the token and user information as a response
    res.json({ message: 'Login successful' });
  } catch (err) {
    next(err);
  }
});

// route for updating the user's coin
router.post('/update-coin/:id', verifyToken, async (req, res) => {
  try {
    const { coinReceived } = req.body;
    const userId = req.params.id;

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user's balance is greater than or equal to the amount to delete
    if (user.balance >= coinReceived) {
      // Subtract the amount to delete from the balance
      user.balance -= coinReceived;

      // Add the deleted amount to the user's coins
      user.user_coin += coinReceived;

      // Save the updated user document
      await user.save();

      return res.json({ message: 'Coin updated successfully' });
    } else if (user.balance < coinReceived && user.balance !== 0) {
      // Add the remaining balance to user's coins
      user.user_coin += user.balance;

      user.balance = 0;

      // Save the updated user document
      await user.save();

      return res.json({ message: 'Coin updated successfully' });
    } else {
      return res.json({
        message: 'You have received all your coins this week.',
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
