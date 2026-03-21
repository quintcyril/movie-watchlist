const express = require('express');
const fs = require('fs');
const path = require('path');

const MOVIES_FILE = path.join(__dirname, 'reviews.json');
const router = express.Router();

router.get('/', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(MOVIES_FILE));
  res.json(reviews);
});

router.post('/', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(MOVIES_FILE));

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

  fs.writeFileSync(MOVIES_FILE, JSON.stringify(reviews, null, 2));

  // res.status(201).json(newReview);
});

router.delete('/:id', (req,res) => {
  const id = parseInt(req.params.id);
  console.log('server side: ', id)
  const reviews = JSON.parse(fs.readFileSync(MOVIES_FILE));

  const newReviews = reviews.filter((r) => r.id != id);
  fs.writeFileSync(MOVIES_FILE, JSON.stringify(newReviews,null,2));
  res.json({ success: true });
})

module.exports = router;