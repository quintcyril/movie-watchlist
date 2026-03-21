const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const REVIEWS_FILE = path.join(__dirname, 'review.json');

// Helper: read reviews from file
function readReviews() {
  if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify([], null, 2));
  }
  const data = fs.readFileSync(REVIEWS_FILE);
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper: write reviews to file
function writeReviews(reviews) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

// GET /reviews — get all reviews
router.get('/', (req, res) => {
  const reviews = readReviews();
  res.json(reviews);
});

// GET /reviews/:movieId — get all reviews for a specific movie
router.get('/:movieId', (req, res) => {
  const reviews = readReviews();
  const movieId = parseInt(req.params.movieId);
  const movieReviews = reviews.filter(r => r.movieId === movieId);
  res.json(movieReviews);
});

// POST /reviews — add a new review
// Expected body: { movieId, author, rating, text }
router.post('/', (req, res) => {
  const reviews = readReviews();
  const { movieId, author, rating, text } = req.body;

  console.log('Received body:', req.body); // ← add this to confirm

  if (!movieId || !text) {
    return res.status(400).json({ error: 'movieId and text are required.' });
  }

  const newReview = {
    id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
    movieId: parseInt(movieId),
    author: author || 'Anonymous',
    rating: rating ? parseInt(rating) : null,
    text,
    createdAt: new Date().toISOString(),
  };

  reviews.push(newReview);
  writeReviews(reviews);
  res.status(201).json(newReview);
});

// PUT /reviews/:id — edit an existing review
// Expected body: { author, rating, text }
router.put('/:id', (req, res) => {
  const reviews = readReviews();
  const id = parseInt(req.params.id);
  const idx = reviews.findIndex(r => r.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  const { author, rating, text } = req.body;
  reviews[idx] = {
    ...reviews[idx],
    ...(author !== undefined && { author }),
    ...(rating !== undefined && { rating: parseInt(rating) }),
    ...(text !== undefined && { text }),
    updatedAt: new Date().toISOString(),
  };

  writeReviews(reviews);
  res.json(reviews[idx]);
});

// DELETE /reviews/:id — delete a review
router.delete('/:id', (req, res) => {
  const reviews = readReviews();
  const id = parseInt(req.params.id);
  const filtered = reviews.filter(r => r.id !== id);

  if (filtered.length === reviews.length) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  writeReviews(filtered);
  res.json({ success: true });
});

module.exports = router;