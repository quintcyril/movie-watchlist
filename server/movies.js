const express = require('express');
const fs = require('fs');
const path = require('path');

// Path to the reviews.json file
const REVIEWS_FILE = path.join(__dirname, 'movies.json');
const router = express.Router();

// Get all reviews
router.get('/', (req, res) => {
  // Read reviews from the file
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  // Return the reviews as JSON
  res.json(reviews);
});

// Add a new review
router.post('/', (req, res) => {
  // Read current reviews
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));

  // Create a new review object
  const newReview = {
    id: Date.now(),          // unique ID based on timestamp
    movieId: req.body.movieId, 
    review: req.body.review
  };

  // Add the new review to the array
  reviews.push(newReview);

  // Write updated reviews back to the file
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));

  // Return the new review as JSON
  res.json(newReview);
});

module.exports = router;