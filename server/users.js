const express = require('express');
const router = express.Router();


// Example: Get all users
router.get('/', (req, res) => {
  res.json([{ id: 1, user: 'Alice'}, { id: 2, name: 'Bob' }]);
});

// Example: Add user
router.post('/', (req, res) => {
  // Add user logic here
  res.json({ success: true });
});

module.exports = router;
