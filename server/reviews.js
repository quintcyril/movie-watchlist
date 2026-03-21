const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const REVIEWS_FILE = path.join(__dirname, 'review.json');

router.get('/', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  const { movieId } = req.query;

  if (movieId) {
    return res.json(reviews.filter(review => review.movieId === parseInt(movieId)));
  }
  res.json(reviews);
});

router.post('/', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  const { movieId, reviewText, rating} = req.body;

  const newReview = {
    id: reviews.length > 0 ? reviews[reviews.length - 1].id + 1 : 1,
    movieId,
    reviewText,
    rating: rating || null,
    createdAt: new Date().toISOString()
  };

  reviews.push(newReview);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
  res.json(newReview );
});

router.put('/:id', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  const id = parseInt(req.params.id);
  const { reviewText, rating } = req.body;

  const idx = reviews.findIndex(r => r.id === id);

  if (idx !== -1) {
    reviews[idx] = { ...reviews[idx], reviewText, rating };
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    res.json(reviews[idx]);
  } else {
    res.status(404).json({ error: 'Review not found' });
  }
});

router.delete('/:id', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  const id = parseInt(req.params.id);

  const filtered = reviews.filter(r => r.id !== id);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(filtered, null, 2));
  res.json({ success: true });
});

module.exports = router;