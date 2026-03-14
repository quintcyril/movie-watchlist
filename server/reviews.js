const express = require('express');
const router = express.Router();

// Temporary in-memory storage for reviews
let reviews = [];  // <-- THIS MUST EXIST

// Get all reviews
router.get('/', (req, res) => {
  res.json(reviews);
});

// Add review
router.post('/', (req, res) => {
  const newReview = {
    id: Date.now(),
    movieId: req.body.movieId,
    review: req.body.review
  };

  reviews.push(newReview);
  res.json(newReview);
});

// Delete review
router.delete('/:id', (req, res) => {
  reviews = reviews.filter(r => r.id != req.params.id);
  res.json({ success: true });
});

// Edit review
router.put('/:id', (req, res) => {
  const review = reviews.find(r => r.id == req.params.id);

  if (review) {
    review.review = req.body.review;
  }

  res.json(review);
});

module.exports = router;