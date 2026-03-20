const express = require('express');
const fs = require('fs');
const path = require('path');

const MOVIES_FILE = path.join(__dirname, 'reviews.json');
const router = express.Router();

// GET all reviews
router.get('/', (req, res) => {
  // Read reviews from file
  const reviews = JSON.parse(fs.readFileSync(MOVIES_FILE, 'utf-8'));
  res.json(reviews);
});

// POST a new review
router.post('/', (req, res) => {
  // Read current reviews
  const reviews = JSON.parse(fs.readFileSync(MOVIES_FILE, 'utf-8'));

  // Make sure req.body has movieId and review
  const { movieId, review } = req.body;

  if (!movieId || !review) {
    return res.status(400).json({ error: 'movieId and review are required' });
  }

  const newReview = {
    id: Date.now(),
    movieId,
    review
  };

  reviews.push(newReview);

  // Write updated reviews back to file
  fs.writeFileSync(MOVIES_FILE, JSON.stringify(reviews, null, 2), 'utf-8');

  res.status(201).json(newReview);
});

module.exports = router;