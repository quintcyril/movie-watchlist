const express = require('express');
const fs = require('fs');
const path = require('path');

const REVIEWS_FILE = path.join(__dirname, 'reviews.json');
const router = express.Router();

// Get all reviews or reviews for a specific movie or user
router.get('/', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  const { movieId, userId } = req.query;
  let filtered = reviews;
  if (movieId) {
    filtered = filtered.filter(r => r.movieId === parseInt(movieId));
  }
  if (userId) {
    filtered = filtered.filter(r => r.userId === userId);
  }
  res.json(filtered);
});

// Add review
router.post('/', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  const newReview = req.body;
  newReview.id = reviews.length ? reviews[reviews.length - 1].id + 1 : 1;
  reviews.push(newReview);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
  res.json(newReview);
});

// Update review
router.put('/:id', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  const id = parseInt(req.params.id);
  const updated = req.body;
  const idx = reviews.findIndex(r => r.id === id);
  if (idx !== -1) {
    reviews[idx] = { ...reviews[idx], ...updated };
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    res.json(reviews[idx]);
  } else {
    res.status(404).send('Review not found');
  }
});

// Delete review
router.delete('/:id', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  const id = parseInt(req.params.id);
  const idx = reviews.findIndex(r => r.id === id);
  if (idx !== -1) {
    const deleted = reviews.splice(idx, 1);
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    res.json(deleted[0]);
  } else {
    res.status(404).send('Review not found');
  }
});

module.exports = router;
