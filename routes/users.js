const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path'); // Import the 'path' module
const mongoose = require('mongoose');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const { upload } = require('../middleware/multer.js'); // Import the multer configuration

//get users all
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().select('-user_password').exec();

    if (!users) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET a single user's data, including their profile image
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-user_password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const imagePath = path.join(__dirname, '..', user.user_image);
    console.log('imgPath => ', imagePath);
    // const imagePath = user.user_image;

    console.log('Constructed imagePath:', imagePath);

    console.log(imagePath);
    // Check if the image file exists
    if (!fs.existsSync(imagePath)) {
      console.log('Image not found at:', imagePath);
      return res.status(404).json({ error: 'Image not found' });
    }

    // Read the image file as a binary buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Convert the image buffer to a base64-encoded string
    const base64Image = imageBuffer.toString('base64');

    // Include the base64-encoded image in the API response
    const userDataWithImage = {
      ...user.toObject(), // Convert Mongoose document to plain object
      imgBase64: base64Image,
    };

    res.json(userDataWithImage);
  } catch (err) {
    next(err);
  }
});

//create user
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

// route for updating the user's coin
router.post('/update-coin/:id', async (req, res) => {
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
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
