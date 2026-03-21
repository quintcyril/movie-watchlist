
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to users.json file
const USERS_FILE = path.join(__dirname, 'users.json');

// Get all users
router.get('/', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read users file.' });
  }
});

// Add a new user
router.post('/', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    const newUser = req.body;
    // Check if username already exists
    if (users.some(u => u.username === newUser.username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add user.' });
  }
});

module.exports = router;
