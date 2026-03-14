const express = require('express');
const router = express.Router();

// Example: Get all reviews
router.get('/', (req, res) => {
  res.json([{ id: 1, movieId: 1, review: 'Great movie!' }]);
});

// Example: Add review
router.post('/', (req, res) => {
  // Add review logic here
  res.json({ success: true });
});

module.exports = router;




















