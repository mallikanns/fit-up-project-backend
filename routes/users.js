const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const { upload } = require('../middleware/multer.js'); // Import the multer configuration

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().select('-user_password').exec();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const users = await User.findById(req.params.id).select('-user_password');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post('/', upload.single('user_image'), async (req, res, next) => {
  try {
    const { user_username } = req.body;

    const user = await User.findOne({ user_username }).select('-user_password');

    if (user) {
      return res.status(404).json({ message: 'Username is already used' });
    }

    // Check if req.file is defined and contains the uploaded image
    const userImagePath = req.file
      ? req.file.path
      : 'public\\images\\Profile\\default_img.jpg';

    // Create a new user object with the uploaded image path
    const newUser = new User({
      ...req.body,
      user_image: userImagePath,
    });

    // Save the user to the database
    await newUser.save();

    res.json(newUser);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', upload.single('user_image'), async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    updatedData.user_image = 'public\\images\\Profile\\default_img.jpg';

    // Check if the request included an image update
    if (req.file) {
      // If an image was uploaded, update the user_image field with the new path
      updatedData.user_image = req.file.path;
    }

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user doesn't exist, return an error response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's data with the provided updates
    user.set(updatedData);

    // Validate the user document
    const validationError = user.validateSync();

    console.log(validationError);
    console.log(updatedData);

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

router.post('/login', async (req, res, next) => {
  const { user_username, user_password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ user_username });

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

    // If everything is valid, send the user information as a response
    res.json({ message: 'Login successful', user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
