const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

// Helper: read reviews from file
function readReviews() {
  if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(REVIEWS_FILE));
}

// Helper: write reviews to file
function writeReviews(data) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(data, null, 2));
}

// GET /reviews — get all reviews
router.get('/', (req, res) => {
  res.json(readReviews());
});

// GET /reviews/:movieId — get all reviews for a movie
router.get('/:movieId', (req, res) => {
  const reviews = readReviews();
  res.json(reviews[req.params.movieId] || []);
});

// POST /reviews/:movieId — add a review for a movie
router.post('/:movieId', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Review text is required' });

  const reviews = readReviews();
  const movieId = req.params.movieId;

  if (!reviews[movieId]) reviews[movieId] = [];
  reviews[movieId].push(text.trim());

  writeReviews(reviews);
  res.json(reviews[movieId]);
});

// PUT /reviews/:movieId/:index — edit a review
router.put('/:movieId/:index', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Review text is required' });

  const reviews = readReviews();
  const { movieId, index } = req.params;
  const idx = parseInt(index);

  if (!reviews[movieId] || reviews[movieId][idx] === undefined) {
    return res.status(404).json({ error: 'Review not found' });
  }

  reviews[movieId][idx] = text.trim();
  writeReviews(reviews);
  res.json(reviews[movieId]);
});

// DELETE /reviews/:movieId/:index — delete a review
router.delete('/:movieId/:index', (req, res) => {
  const reviews = readReviews();
  const { movieId, index } = req.params;
  const idx = parseInt(index);

  if (!reviews[movieId]) return res.status(404).json({ error: 'No reviews for this movie' });

  reviews[movieId].splice(idx, 1);
  writeReviews(reviews);
  res.json(reviews[movieId]);
});

module.exports = router;
