import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);

  useEffect(() => {
    // Retrieve watched movies from backend
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  // TODO: Implement add review functionality for watched movies
   const handleAddReview = (movieId) => {
    const text = newReview[movieId];
    if (!text) return;

    fetch('http://localhost:3000/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, review: text })
    })
      .then(res => res.json())
      .then(data => {
        setReviews(prev => [...prev, data.data]);
        setNewReview(prev => ({ ...prev, [movieId]: '' }));
      });
  };
  // TODO: Implement edit/delete review functionality
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/reviews/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setReviews(prev => prev.filter(r => r.id !== id));
      });
  };

  // Start editing
  const handleEditStart = (review) => {
    setEditingReviewId(review.id);
    setEditingText(review.review);
  };

  // Save edit
  const handleEditSave = (id) => {
    fetch(`http://localhost:3000/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: editingText })
    })
      .then(res => res.json())
      .then(data => {
        setReviews(prev =>
          prev.map(r => (r.id === id ? data.data : r))
        );
        setEditingReviewId(null);
        setEditingText('');
      });
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
            {/* TODO: Add review form and display reviews for this movie */ <TextField
                fullWidth
                size="small"
                placeholder="Write a review..."
                value={newReview[movie.id] || ''}
                onChange={(e) =>
                  setNewReview(prev => ({
                    ...prev,
                    [movie.id]: e.target.value
                  }))
                }
                sx={{ mt: 1 }}
              />}
            <Button variant="contained" color="primary" sx={{ mt: 1 }}>
              Add Review {/* TODO: Implement add review for this movie */}
              <TextField
              fullWidth
              size="small"
              placeholder="Write a review..."
              value={newReview[movie.id] || ''}
              onChange={(e) =>
                setNewReview(prev => ({
                  ...prev,
                  [movie.id]: e.target.value
                }))
              }
              sx={{ mt: 1 }}
            />

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={() => handleAddReview(movie.id)}
            >
              Add Review
            </Button>

            {}
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
