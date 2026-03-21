const express = require('express');
const router = express.Router();

// ✅ NEW: In-memory storage
let reviews = [
  { id: 1, movieId: 1, review: 'Great movie!' }
];

// ✅ NEW: Helper for IDs
let nextId = 2;

// Example: Get all reviews
router.get('/', (req, res) => {
  res.json(reviews); // ✅ now returns real data
});

// ✅ NEW: Get reviews by movieId
router.get('/movie/:movieId', (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const movieReviews = reviews.filter(r => r.movieId === movieId);
  res.json(movieReviews);
});

// Example: Add review
router.post('/', (req, res) => {
  // Add review logic here

  const { movieId, review } = req.body;

  if (!movieId || !review) {
    return res.status(400).json({ error: 'movieId and review are required' });
  }

  const newReview = {
    id: nextId++,
    movieId,
    review
  };

  reviews.push(newReview);

  res.json({ success: true, data: newReview });
});

// ✅ NEW: Update review
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { review } = req.body;

  const reviewItem = reviews.find(r => r.id === id);

  if (!reviewItem) {
    return res.status(404).json({ error: 'Review not found' });
  }

  reviewItem.review = review;

  res.json({ success: true, data: reviewItem });
});

// ✅ NEW: Delete review
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = reviews.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Review not found' });
  }

  const deleted = reviews.splice(index, 1);

  res.json({ success: true, data: deleted[0] });
});

module.exports = router;