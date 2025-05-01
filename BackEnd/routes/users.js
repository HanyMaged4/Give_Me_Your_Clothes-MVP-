const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const router = express.Router();

const USERS_DB = './data/users.json';
const SECRET_KEY = 'your_secret_key';

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const users = await fs.readJson(USERS_DB).catch(() => []);
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  users.push({ username, password });
  await fs.writeJson(USERS_DB, users);
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = await fs.readJson(USERS_DB).catch(() => []);
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Profile
router.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ username: decoded.username });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
