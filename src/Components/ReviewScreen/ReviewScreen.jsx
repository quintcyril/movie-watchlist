import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'; // Added for the review input

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  
  // New state to handle typing in the input fields and toggling edit mode
  const [reviewInputs, setReviewInputs] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // Retrieve watched movies from backend
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  // TODO: Implement add review functionality for watched movies
  const handleSaveReview = (id) => {
    const reviewText = reviewInputs[id] || '';
    if (!reviewText.trim()) return;

    // Update local UI state
    setWatchedMovies(prev => prev.map(m => m.id === id ? { ...m, review: reviewText } : m));
    
    // Send update to backend
    fetch(`http://localhost:3001/movies/${id}`, {
      method: 'PUT', // Changed to PUT to match your backend
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: reviewText })
    }).catch(err => console.error(err));

    setEditingId(null); // Exit edit mode if active
  };

  // TODO: Implement edit/delete review functionality
  const handleEditClick = (id, currentReview) => {
    setReviewInputs(prev => ({ ...prev, [id]: currentReview }));
    setEditingId(id);
  };

  const handleDeleteReview = (id) => {
    // Clear from UI
    setWatchedMovies(prev => prev.map(m => m.id === id ? { ...m, review: null } : m));
    setReviewInputs(prev => ({ ...prev, [id]: '' }));
    
    // Clear from backend
    fetch(`http://localhost:3001/movies/${id}`, {
      method: 'PUT', // Changed to PUT to match your backend
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: null })
    }).catch(err => console.error(err));
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
            
            {/* TODO: Add review form and display reviews for this movie */}
            {movie.review && editingId !== movie.id ? (
              <Box sx={{ width: '100%', mb: 1, mt: 1 }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1, color: 'black' }}>
                  "{movie.review}"
                </Typography>
                <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleEditClick(movie.id, movie.review)}>
                  Edit
                </Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteReview(movie.id)}>
                  Delete
                </Button>
              </Box>
            ) : (
              <TextField
                fullWidth
                size="small"
                placeholder="Write your review..."
                value={reviewInputs[movie.id] || ''}
                onChange={(e) => setReviewInputs(prev => ({ ...prev, [movie.id]: e.target.value }))}
                sx={{ mb: 1, mt: 1 }}
              />
            )}

            {/* Hide the add button if they already have a review and aren't currently editing it */}
            {(!movie.review || editingId === movie.id) && (
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 1 }}
                onClick={() => handleSaveReview(movie.id)}
              >
                {editingId === movie.id ? "Save Review" : "Add Review"} {/* TODO: Implement add review for this movie */}
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}