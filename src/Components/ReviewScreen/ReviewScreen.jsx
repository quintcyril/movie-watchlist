import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState({});

  // Fetch watched movies
  useEffect(() => {
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => {
        const watched = data.filter(movie => movie.watched);

        const initialReviews = {};
        watched.forEach(movie => {
          if (!movie.reviews) movie.reviews = [];
          initialReviews[movie.id] = movie.reviews;
        });

        setWatchedMovies(watched);
        setReviews(initialReviews);
      });
  }, []);

  // Handle input change
  const handleInputChange = (movieId, value) => {
    setNewReview({
      ...newReview,
      [movieId]: value
    });
  };

  // ✅ ADD REVIEW (FIXED)
  const addReview = async (movieId) => {
    if (!newReview[movieId]) return;

    const movie = watchedMovies.find(m => m.id === movieId);

    const updatedMovie = {
      ...movie,
      reviews: [...(movie.reviews || []), newReview[movieId]]
    };

    try {
      const res = await fetch(`http://localhost:3001/movies/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovie)
      });

      const data = await res.json();

      setReviews({
        ...reviews,
        [movieId]: data.reviews
      });

      setWatchedMovies(
        watchedMovies.map(m => (m.id === movieId ? data : m))
      );

      setNewReview({
        ...newReview,
        [movieId]: ''
      });

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ EDIT REVIEW (FIXED)
  const editReview = async (movieId, index) => {
    const movie = watchedMovies.find(m => m.id === movieId);
    const updatedText = prompt("Edit your review:", reviews[movieId][index]);
    if (!updatedText) return;

    const updatedReviews = [...(movie.reviews || [])];
    updatedReviews[index] = updatedText;

    const updatedMovie = {
      ...movie,
      reviews: updatedReviews
    };

    try {
      const res = await fetch(`http://localhost:3001/movies/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovie)
      });

      const data = await res.json();

      setReviews({
        ...reviews,
        [movieId]: data.reviews
      });

      setWatchedMovies(
        watchedMovies.map(m => (m.id === movieId ? data : m))
      );

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE REVIEW (FIXED)
  const deleteReview = async (movieId, index) => {
    const movie = watchedMovies.find(m => m.id === movieId);

    const updatedReviews = [...(movie.reviews || [])];
    updatedReviews.splice(index, 1);

    const updatedMovie = {
      ...movie,
      reviews: updatedReviews
    };

    try {
      const res = await fetch(`http://localhost:3001/movies/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovie)
      });

      const data = await res.json();

      setReviews({
        ...reviews,
        [movieId]: data.reviews
      });

      setWatchedMovies(
        watchedMovies.map(m => (m.id === movieId ? data : m))
      );

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 6,
        p: 3,
        bgcolor: '#fafafa',
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>

      <List>
        {watchedMovies.map(movie => (
          <ListItem
            key={movie.id}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <ListItemText primary={movie.title} secondary={movie.genre} />

            <TextField
              label="Write a review"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              value={newReview[movie.id] || ""}
              onChange={(e) => handleInputChange(movie.id, e.target.value)}
            />

            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() => addReview(movie.id)}
            >
              Add Review
            </Button>

            {(reviews[movie.id] || []).map((review, index) => (
              <Box
                key={index}
                sx={{ mt: 1, p: 1, width: '100%', bgcolor: '#eee', borderRadius: 1 }}
              >
                <Typography variant="body2">{review}</Typography>

                <Button size="small" onClick={() => editReview(movie.id, index)}>
                  Edit
                </Button>

                <Button
                  size="small"
                  color="error"
                  onClick={() => deleteReview(movie.id, index)}
                >
                  Delete
                </Button>
              </Box>
            ))}

          </ListItem>
        ))}
      </List>
    </Box>
  );
}