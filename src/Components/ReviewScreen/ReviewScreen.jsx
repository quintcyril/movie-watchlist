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
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [reviewText, setReviewText] = useState("");
 

  useEffect(() => {
    // Retrieve watched movies from backend
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  //TODO: Implement add review functionality for watched movies
  const handleAddReview = (id) => {
    const review = reviewText[id];
    if (!review || review.trim() === '') return;

    
    fetch('http://localhost:3001/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId: id, reviewText: review })
    })
      .then(res => res.json())
      .then(data => {
        
        setWatchedMovies(
          watchedMovies.map((movie) => 
            movie.id === id ? { ...movie, review } : movie
          )
        );
        
        setReviewText({ ...reviewText, [id]: '' });
      })
      .catch(err => console.error('Error adding review:', err));
  };

  // TODO: Implement edit/delete review functionality
  
  const handleEditReview = (id) => {
    if (!editText || editText.trim() === '') return;

    fetch(`http://localhost:3001/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewText: editText })
    })
      .then(res => res.json())
      .then(data => {
        setWatchedMovies(
          watchedMovies.map((movie) =>
            movie.id === id ? { ...movie, review: editText } : movie
          )
        );
        setEditingId(null);
        setEditText('');
      })
      .catch(err => console.error('Error editing review:', err));
  };

  const handleDeleteReview = (id) => {
    fetch(`http://localhost:3001/reviews/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        setWatchedMovies(
          watchedMovies.map((movie) =>
            movie.id === id ? { ...movie, review: null } : movie
          )
        );
      })
      .catch(err => console.error('Error deleting review:', err));
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

            {movie.review && editingId !== movie.id && (
              <Box sx={{ width: '100%', mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Your Review:</Typography>
                <Typography variant="body2">{movie.review}</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small" onClick={() => { setEditingId(movie.id); setEditText(movie.review); }}>Edit</Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteReview(movie.id)}>Delete</Button>
                </Box>
              </Box>
            )}

            {/* Edit review form */}
            {editingId === movie.id && (
              <Box sx={{ width: '100%', mt: 1 }}>
                <TextField fullWidth multiline rows={3} value={editText} onChange={(e) => setEditText(e.target.value)} placeholder="Editing review..." variant="outlined" size="small" />
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button variant="contained" color="primary" size="small" onClick={() => handleEditReview(movie.id)}>Save</Button>
                  <Button variant="outlined" size="small" onClick={() => { setEditingId(null); setEditText(''); }}>Cancel</Button>
                </Box>
              </Box>
            )}

            {/* Add review form */}
            {!movie.review && editingId !== movie.id && (
              <Box sx={{ width: '100%', mt: 1 }}>
                <TextField fullWidth multiline rows={2} value={reviewText[movie.id] || ''} onChange={(e) => setReviewText({ ...reviewText, [movie.id]: e.target.value })} placeholder="Add your review..." variant="outlined" size="small" />
                <Button variant="contained" color="primary" sx={{ mt: 1 }} 
                onClick={() => handleAddReview(movie.id)}>
                  Add Review {/* TODO: Implement add review for this movie */}
                  </Button>
              </Box>
            )}

          </ListItem>
        ))}
      </List>
    </Box>
  );
}
