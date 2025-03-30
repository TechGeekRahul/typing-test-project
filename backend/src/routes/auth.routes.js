const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/config');
const auth = require('../middleware/auth.middleware');


router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

 
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

   
    const user = new User({ username, email, password });
    await user.save();

  
    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN
    });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

 
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  
    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN
    });

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 