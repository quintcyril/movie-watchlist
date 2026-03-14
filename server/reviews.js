// Import the Express library to create a router for handling review-related routes
const express = require('express');
// Import the 'fs' module to work with the file system (reading/writing files)
const fs = require('fs');
const path = require('path');
// Define the path to the reviews.json file where review data is stored
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');
const router = express.Router();

// Helper to read reviews and ensure each review has a unique numeric `id`.
function readAndEnsureIds() {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  let maxId = reviews.reduce((m, r) => Math.max(m, r.id || 0), 0);
  let changed = false;
  reviews.forEach(r => {
    if (!r.id) {
      maxId += 1;
      r.id = maxId;
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
  }
  return reviews;
}


// Get reviews
// Route to get all reviews
// This handles GET requests to '/reviews' and returns the list of reviews
router.get('/', (req, res) => {
  const reviews = readAndEnsureIds();
  res.json(reviews);
});

// Add review
// Route to add a new review
// This handles POST requests to '/reviews' and adds a new review to the list
router.post('/', (req, res) => {
  const reviews = readAndEnsureIds();
  const newReview = req.body;
  const nextId = reviews.reduce((m, r) => Math.max(m, r.id || 0), 0) + 1;
  newReview.id = nextId;
  reviews.push(newReview);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
  res.json(newReview);
});

// Update review
router.put('/:id', (req, res) => {
  const reviews = readAndEnsureIds();
  const id = parseInt(req.params.id);
  const updated = req.body;
  const idx = reviews.findIndex(r => r.id === id);
  if (idx !== -1) {
    reviews[idx] = { ...reviews[idx], ...updated };
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    res.json(reviews[idx]);
  } else {
    res.status(404).send('Review not found');
  }
});

// Delete review
// Route to delete a review by its ID
// This handles DELETE requests to '/reviews/:id' and removes the specified review
router.delete('/:id', (req, res) => {
  const reviews = readAndEnsureIds();
  const id = parseInt(req.params.id);
  const filtered = reviews.filter(r => r.id !== id);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(filtered, null, 2));
  res.json({ success: true });
});

// Export the router so it can be used in the main server file
module.exports = router;
