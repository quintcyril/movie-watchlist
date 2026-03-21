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

  // Validate input
  if (!movieId || !review || review.trim() === '') {
    return res.status(400).json({ error: 'movieId and review are required' });
  }

  // Create new review
  const newReview = {
    id: Date.now(),          
    movieId: Number(movieId),
    review: review.trim(),
    createdAt: new Date()
  };

  // Save to in-memory "database"
  reviews.push(newReview);

  // Return the new review
  res.status(201).json({
    success: true,
    data: newReview
  });
  res.json({ success: true });
});

module.exports = router;
