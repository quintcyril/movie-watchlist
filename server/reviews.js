const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const reviewsFile = path.join(__dirname, 'reviews.json');

// load persisted reviews (fallback to empty array)
let reviews = [];
try {
  const raw = fs.readFileSync(reviewsFile, 'utf8');
  reviews = JSON.parse(raw || '[]');
} catch (e) {
  console.warn('reviews.json load failed, starting with empty array:', e.message);
  reviews = [];
}

function saveReviews() {
  try {
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2), 'utf8');
    console.log('reviews.json saved, entries:', reviews.length);
  } catch (err) {
    console.error('Failed to write reviews.json:', err);
  }
}

// Get all reviews
router.get('/', (req, res) => {
  res.json(reviews);
});

// Add a review
router.post('/', (req, res) => {
  const { id, movieId, text } = req.body || {};
  if (!movieId || !text) {
    return res.status(400).json({ error: 'movieId and text are required' });
  }
  const newId = id || Date.now();
  const review = { id: newId, movieId, text };
  reviews.push(review);
  saveReviews();
  res.status(201).json(review);
});

// Update a review
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });

  const idx = reviews.findIndex(r => Number(r.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'Review not found' });

  reviews[idx] = { ...reviews[idx], text };
  saveReviews();
  res.json(reviews[idx]);
});

// Delete a review
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = reviews.findIndex(r => Number(r.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'Review not found' });

  const deleted = reviews.splice(idx, 1)[0];
  saveReviews();
  res.json(deleted);
});

module.exports = router;
