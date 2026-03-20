const express = require('express');
const router = express.Router();

let reviews = [
  { id: 1, movieId: 1, review: 'Great movie!' }
];

router.get('/', (req, res) => {
  res.json(reviews);
});

// Add review
router.post('/', (req, res) => {
  const newReview = {
    id: Date.now(),
    movieId: req.body.movieId,
    review: req.body.review
  };

  reviews.push(newReview);
  res.json(newReview);
});


//  Edit review
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const foundReview = reviews.find(review => review.id === id);

  if (foundReview) {
    foundReview.review = req.body.review;
    res.json(foundReview);
  } else {
    res.status(404).json({ message: 'Review not found' });
  }
});

/// Delete review
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  reviews = reviews.filter(review => review.id !== id);

  res.json({ message: 'Review deleted' });
});

module.exports = router;
