const express = require('express');
const router = express.Router();

// Example: Get all reviews
router.get('/', (req, res) => {
  res.json([{ id: 1, movieId: 1, review: 'Great movie!' }]);
});

// Example: Add review
router.post('/', (req, res) => {
  // Add review logic here
  const { movieId, review } = req.body;
  if (!movieId || !review)
    return res.status(400).json({ success: false, error: 'movieId and review are required' });

  const reviews = readReviews();
  const newReview = { id: Date.now(), movieId: Number(movieId), review };
  reviews.push(newReview);
  writeReviews(reviews);
  res.status(201).json({ success: true, data: newReview });
});


router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { review } = req.body;
  if (!review)
    return res.status(400).json({ success: false, error: 'review text is required' });

  const reviews = readReviews();
  const target = reviews.find(r => r.id === id);
  if (!target)
    return res.status(404).json({ success: false, error: 'Review not found' });

  target.review = review;
  writeReviews(reviews);
  res.json({ success: true, data: target });
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const reviews = readReviews();
  const index = reviews.findIndex(r => r.id === id);
  if (index === -1)
    return res.status(404).json({ success: false, error: 'Review not found' });

  const [deleted] = reviews.splice(index, 1);
  writeReviews(reviews);
  res.json({ success: true, data: deleted });
});


module.exports = router;
