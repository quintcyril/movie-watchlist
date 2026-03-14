// Import the Express library to create a router for handling movie-related routes
const express = require('express');
// Import the 'fs' module to work with the file system (reading/writing files)
const fs = require('fs');
const path = require('path');
// Define the path to the movies.json file where movie data is stored
const MOVIES_FILE = path.join(__dirname, 'movies.json');
const router = express.Router();


// Get movies
// Route to get all movies
// This handles GET requests to '/movies' and returns the list of movies
router.get('/', (req, res) => {
    // Read the movies from the file synchronously
    const movies = JSON.parse(fs.readFileSync(MOVIES_FILE));
    // Send the movies array as a JSON response
    res.json(movies);
});

// Add movie
// Route to add a new movie
// This handles POST requests to '/movies' and adds a new movie to the list
router.post('/', (req, res) => {
    // Read the current movies from the file synchronously
    const movies = JSON.parse(fs.readFileSync(MOVIES_FILE));
    // Get the new movie data from the request body
    const newMovie = req.body;
    // Add the new movie to the movies array
    movies.push(newMovie);
    // Write the updated movies array back to the file
    fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2));
    // Send the new movie as a JSON response
    res.json(newMovie);
});

// Update movie
router.put('/:id', (req, res) => {
  const movies = JSON.parse(fs.readFileSync(MOVIES_FILE));
  const id = parseInt(req.params.id);
  const updated = req.body;
  const idx = movies.findIndex(m => m.id === id);
  if (idx !== -1) {
    movies[idx] = { ...movies[idx], ...updated };
    fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2));
    res.json(movies[idx]);
  } else {
    res.status(404).send('Movie not found');
  }
});

// Delete movie
// Route to delete a movie by its ID
// This handles DELETE requests to '/movies/:id' and removes the specified movie
router.delete('/:id', (req, res) => {
    // Read the current movies from the file synchronously
    const movies = JSON.parse(fs.readFileSync(MOVIES_FILE));
    // Get the movie ID from the request parameters
    const id = parseInt(req.params.id);
    // Filter out the movie with the given ID
    const filtered = movies.filter(m => m.id !== id);
    // Write the updated movies array back to the file
    fs.writeFileSync(MOVIES_FILE, JSON.stringify(filtered, null, 2));
    // Send a success message
    res.json({ success: true });
});

// Export the router so it can be used in the main server file
module.exports = router;
