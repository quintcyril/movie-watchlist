const express = require('express');
const router = express.Router();

let reviews = [
  { id: 1, movieId: 1, review: 'Great movie!' }
];

// 👉 GET all reviews
router.get('/', (req, res) => {
  res.json(reviews);
});

// 👉 GET reviews by movieId
router.get('/:movieId', (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const movieReviews = reviews.filter(r => r.movieId === movieId);
  res.json(movieReviews);
});

// 👉 ADD review
router.post('/', (req, res) => {
  const { movieId, review } = req.body;

  if (!movieId || !review) {
    return res.status(400).json({ error: 'movieId and review are required' });
  }

  const newReview = {
    id: Date.now(),
    movieId,
    review
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

// 👉 UPDATE review
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { review } = req.body;

  const index = reviews.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Review not found' });
  }

  reviews[index].review = review;
  res.json(reviews[index]);
});

// 👉 DELETE review
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = reviews.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Review not found' });
  }

  const deleted = reviews.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;