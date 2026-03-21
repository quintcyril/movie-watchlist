const express = require('express');
const fs = require('fs');
const router = express.Router();

const FILE_PATH = './reviews.json';

// Helper: read reviews
const readReviews = () => {
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
};

// Helper: write reviews
const writeReviews = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// GET all reviews
router.get('/', (req, res) => {
  const reviews = readReviews();
  res.json(reviews);
});

// GET reviews by movieId
router.get('/:movieId', (req, res) => {
  const reviews = readReviews();
  const filtered = reviews.filter(r => r.movieId == req.params.movieId);
  res.json(filtered);
});

// ADD review
router.post('/', (req, res) => {
  const { movieId, review } = req.body;
  const reviews = readReviews();

  const newReview = {
    id: Date.now(),
    movieId,
    review
  };

  reviews.push(newReview);
  writeReviews(reviews);

  res.json(newReview);
});

// UPDATE review
router.put('/:id', (req, res) => {
  const reviews = readReviews();
  const { review } = req.body;

  const updated = reviews.map(r =>
    r.id == req.params.id ? { ...r, review } : r
  );

  writeReviews(updated);
  res.json({ success: true });
});

// DELETE review
router.delete('/:id', (req, res) => {
  const reviews = readReviews();
  const filtered = reviews.filter(r => r.id != req.params.id);

  writeReviews(filtered);
  res.json({ success: true });
});

module.exports = router;