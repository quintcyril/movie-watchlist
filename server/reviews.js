const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

const readReviews = () => JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8'));
const writeReviews = (data) => fs.writeFileSync(REVIEWS_FILE, JSON.stringify(data, null, 2));

// Get all reviews (optionally filter by movieId)
router.get('/', (req, res) => {
  const reviews = readReviews();
  const { movieId } = req.query;
  if (movieId) {
    return res.json(reviews.filter(r => r.movieId === Number(movieId)));
  }
  res.json(reviews);
});

// Add a review
router.post('/', (req, res) => {
  const reviews = readReviews();
  const newReview = { id: Date.now(), ...req.body };
  reviews.push(newReview);
  writeReviews(reviews);
  res.json(newReview);
});

// Delete a review
router.delete('/:id', (req, res) => {
  const reviews = readReviews();
  const updated = reviews.filter(r => r.id !== Number(req.params.id));
  writeReviews(updated);
  res.json({ success: true });
});

// Update a review
router.put('/:id', (req, res) => {
  const reviews = readReviews();
  const updated = reviews.map(r =>
    r.id === Number(req.params.id) ? { ...r, ...req.body } : r
  );
  writeReviews(updated);
  res.json({ success: true });
});

module.exports = router;