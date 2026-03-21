const express = require('express');
const fs = require('fs');
const path = require('path');
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

const router = express.Router();

// Example: Get all reviews
router.get('/', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  res.json(reviews);
});

// // Example: Add review
router.post('/', (req, res) => {
  // Add review logic here
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  const newReview = req.body;
  reviews.push(newReview)

  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));

  res.json(newReview);
});

// Delete a review
router.delete('/:id', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  const id = parseInt(req.params.id);
  const filtered = reviews.filter(r => r.id !== id);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(filtered, null, 2));
  res.json({ success: true});
});

// Edit/Update a review

router.put('/:id', (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  const id = parseInt(req.params.id);
  const updated = req.body;
  const idx = reviews.findIndex(r => r.id === id);
  if(idx !== -1){
    reviews[idx] = { ...reviews[idx], ...updated };
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    res.json(reviews[idx]);
  } else{
    res.status(404).send('Review not found');
  }


});

module.exports = router;
