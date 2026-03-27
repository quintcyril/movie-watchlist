import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function ReviewScreen() {
  const user = { username: 'alice' }; // Hardcoded for now
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState({});
  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    // Retrieve watched movies from backend
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));

    // Retrieve reviews for the current user
    if (user) {
      fetch(`http://localhost:3001/reviews?userId=${user.username}`)
        .then(res => res.json())
        .then(data => setReviews(data));
    }
  }, [user]);

  const fetchReviews = () => {
    if (user) {
      fetch(`http://localhost:3001/reviews?userId=${user.username}`)
        .then(res => res.json())
        .then(data => setReviews(data));
    }
  };

  const addReview = (movieId) => {
    const text = newReviewText[movieId];
    if (!text || !user) return;
    fetch('http://localhost:3001/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, review: text, userId: user.username }),
    })
      .then(() => {
        setNewReviewText({ ...newReviewText, [movieId]: '' });
        fetchReviews();
      });
  };

  const startEdit = (review) => {
    setEditingReview(review.id);
    setEditText(review.review);
  };

  const saveEdit = (reviewId) => {
    fetch(`http://localhost:3001/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: editText }),
    })
      .then(() => {
        setEditingReview(null);
        setEditText('');
        fetchReviews();
      });
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditText('');
  };

  const deleteReview = (reviewId) => {
    fetch(`http://localhost:3001/reviews/${reviewId}`, {
      method: 'DELETE',
    })
      .then(() => fetchReviews());
  };

  const movieReviews = (movieId) => reviews.filter(r => r.movieId === movieId);

  if (!user) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Please log in to view and manage reviews.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#000' }}>
        Reviews for Watched Movies
      </Typography>
      <List>
        {watchedMovies.map(movie => (
          <ListItem key={movie.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <ListItemText
              primary={movie.title}
              secondary={movie.genre}
              primaryTypographyProps={{ style: { color: '#000' } }}
              secondaryTypographyProps={{ style: { color: '#444' } }}
            />
            {/* Display existing reviews */}
            {movieReviews(movie.id).map(review => (
              <Box key={review.id} sx={{ width: '100%', mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                {editingReview === review.id ? (
                  <Box>
                    <TextField
                      fullWidth
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      multiline
                      rows={2}
                    />
                    <Button onClick={() => saveEdit(review.id)}>Save</Button>
                    <Button onClick={cancelEdit}>Cancel</Button>
                  </Box>
                ) : (
                  <Box>
                    <Typography>{review.review}</Typography>
                    <Button size="small" onClick={() => startEdit(review)}>Edit</Button>
                    <Button size="small" onClick={() => deleteReview(review.id)}>Delete</Button>
                  </Box>
                )}
              </Box>
            ))}
            {/* Add review form */}
            <Box sx={{ width: '100%', mt: 1 }}>
              <TextField
                fullWidth
                placeholder="Write a review..."
                value={newReviewText[movie.id] || ''}
                onChange={(e) => setNewReviewText({ ...newReviewText, [movie.id]: e.target.value })}
                multiline
                rows={2}
              />
              <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => addReview(movie.id)}>
                Add Review
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
