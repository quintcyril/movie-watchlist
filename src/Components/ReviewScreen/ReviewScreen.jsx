import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviewInputs, setReviewInputs] = useState({}); 

  useEffect(() => {
    // Retrieve watched movies from backend
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  // TODO: Implement add review functionality for watched movies
    const handleAddReview = async (movieId) => {
    const text = (reviewInputs[movieId] || '').trim();
    if (!text) return;

    const res = await fetch(`http://localhost:3001/movies/${movieId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const updatedMovie = await res.json();

    setWatchedMovies(prev =>
      prev.map(movie => movie.id === movieId ? updatedMovie : movie)
    );

    setReviewInputs(prev => ({ ...prev, [movieId]: '' }));
  };

  // TODO: Implement edit/delete review functionality
  const handleEditReview = async (movieId) => {
    const newReview = prompt('Edit your review:');
    if (!newReview) return;

    const res = await fetch(`http://localhost:3001/movies/${movieId}/reviews`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newReview })
    });

    const updatedMovie = await res.json();

    setWatchedMovies(prev =>
      prev.map(movie => movie.id === movieId ? updatedMovie : movie)
    );
  };

  const handleDeleteReview = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    const res = await fetch(`http://localhost:3001/movies/${movieId}/reviews`, {
      method: 'DELETE'
    });

    const updatedMovie = await res.json();

    setWatchedMovies(prev =>
      prev.map(movie => movie.id === movieId ? updatedMovie : movie)
    );
  };
    
  
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>
      <List>
        {watchedMovies.map(movie => (
          <ListItem key={movie.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <ListItemText primary={movie.title} secondary={movie.genre} />

            <TextField
              label="Write a review"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={reviewInputs[movie.id] || ''}
              onChange={(e) =>
                setReviewInputs({
                  ...reviewInputs,
                  [movie.id]: e.target.value
                })
              }
              sx={{ mt: 1 }}
            />

            <Button variant="contained" color="primary" sx={{ mt: 1 }}
              onClick={() => handleAddReview(movie.id)}
            >
              Add Review
            </Button>

            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                onClick={() => handleEditReview(movie.id)}
              >
                Edit
              </Button>

              <Button
                size="small"
                color="error"
                onClick={() => handleDeleteReview(movie.id)}
              >
                Delete
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );

}

