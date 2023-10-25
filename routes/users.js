const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path'); // Import the 'path' module
const mongoose = require('mongoose');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken.js');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users);
  } catch (err) {
    next(err);
  }
});

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
      balance: 30000,
    });

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

    const user = await User.findById(userId);

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

    user.set(updatedData);

    const validationError = user.validateSync();

    if (validationError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: validationError.errors,
      });
    }

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  const { user_email, user_password } = req.body;

  try {
    const user = await User.findOne({ user_email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(
      user_password,
      user.user_password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const payload = {
      _id: user._id,
      firstname: user.user_firstName,
      lastname: user.user_lastName,
      username: user.user_username,
      email: user.user_email,
    };

    const token = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    res.json({ message: 'Login successful' });
  } catch (err) {
    next(err);
  }
});

router.post('/update-coin/:id', verifyToken, async (req, res) => {
  try {
    const { coinReceived } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.balance >= coinReceived) {
      user.balance -= coinReceived;

      user.user_coin += coinReceived;

      await user.save();

      return res.json({ message: 'Coin updated successfully' });
    } else if (user.balance < coinReceived && user.balance !== 0) {
      user.user_coin += user.balance;

      user.balance = 0;

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

router.post('/delete-coin/:id', verifyToken, async (req, res) => {
  try {
    const { coinDelete } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.user_coin !== 0) {
      user.user_coin -= coinDelete;
      user.balance += coinDelete;

      if (user.balance > 30000) {
        user.balance = 30000;
      }

      if (user.user_coin < 0) {
        user.user_coin = 0;
      }

      await user.save();

      return res.json({ message: 'Coin updated successfully' });
    } else {
      return res.json({
        message: 'Error Coin is 0.',
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
