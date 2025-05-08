const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../../../server/models/User'); // Assuming you have a User model

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', user: { username: user.username }, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Registration endpoint
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  console.log('Request Body:', req.body); // Debug log

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;