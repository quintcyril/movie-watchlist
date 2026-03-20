const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

const readReviews = () => JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8'));
const writeReviews = (reviews) => fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));

router.get('/', (req, res) => {
  const reviews = readReviews();
  res.json(reviews);
});

router.get('/movie/:movieId', (req, res) => {
  const movieId = parseInt(req.params.movieId, 10);
  const reviews = readReviews();
  const filtered = reviews.filter((r) => r.movieId === movieId);
  res.json(filtered);
});

router.post('/', (req, res) => {
  const { movieId, review } = req.body;
  if (!movieId || !review || !review.trim()) {
    return res.status(400).json({ error: 'movieId and review are required' });
  }

  const reviews = readReviews();
  const newReview = {
    id: Date.now(),
    movieId,
    review: review.trim(),
  };

  reviews.push(newReview);
  writeReviews(reviews);

  res.json(newReview);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { review } = req.body;

  if (!review || !review.trim()) {
    return res.status(400).json({ error: 'review is required' });
  }

  const reviews = readReviews();
  const index = reviews.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Review not found' });
  }

  reviews[index].review = review.trim();
  writeReviews(reviews);

  res.json(reviews[index]);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const reviews = readReviews();
  const newReviews = reviews.filter((r) => r.id !== id);

  if (newReviews.length === reviews.length) {
    return res.status(404).json({ error: 'Review not found' });
  }

  writeReviews(newReviews);
  res.json({ success: true });
});

module.exports = router;
