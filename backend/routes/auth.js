const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sign = (id) => jwt.sign({ userId: id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'All fields required' });
    if (await User.findOne({ $or: [{ email }, { username }] }))
      return res.status(400).json({ error: 'User already exists' });
    const user = await new User({ username, email, password }).save();
    res.status(201).json({ token: sign(user._id), userId: user._id, username: user.username });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: sign(user._id), userId: user._id, username: user.username });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
