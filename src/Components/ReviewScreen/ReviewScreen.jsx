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
  const [activeMovieId, setActiveMovieId] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
  
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  
  const handleAddReview = (movieId) => {
    if (!reviewText.trim()) return;

    const movieReviews = reviews[movieId] || [];

    if (editingIndex !== null) {
      const updated = [...movieReviews];
      updated[editingIndex] = reviewText;
      setReviews({ ...reviews, [movieId]: updated });
      setEditingIndex(null);
    } else {
      setReviews({
        ...reviews,
        [movieId]: [...movieReviews, reviewText],
      });
    }

    setReviewText('');
    setActiveMovieId(null);
  };

 
  const handleEditReview = (movieId, index) => {
    setActiveMovieId(movieId);
    setReviewText(reviews[movieId][index]);
    setEditingIndex(index);
  };

 
  const handleDeleteReview = (movieId, index) => {
    const updated = reviews[movieId].filter((_, i) => i !== index);
    setReviews({ ...reviews, [movieId]: updated });
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

            {}
            {(reviews[movie.id] || []).map((rev, index) => (
              <Box key={index} sx={{ width: '100%', mt: 1 }}>
                <Typography variant="body2">• {rev}</Typography>
                <Button size="small" onClick={() => handleEditReview(movie.id, index)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDeleteReview(movie.id, index)}>Delete</Button>
              </Box>
            ))}

            {}
            {activeMovieId === movie.id && (
              <Box sx={{ mt: 1, width: '100%' }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Write your review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => handleAddReview(movie.id)}
                >
                  {editingIndex !== null ? 'Update Review' : 'Submit Review'}
                </Button>
              </Box>
            )}

            {}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={() => {
                setActiveMovieId(movie.id);
                setReviewText('');
                setEditingIndex(null);
              }}
            >
              Add Review
            </Button>

          </ListItem>
        ))}
      </List>
    </Box>
  );
}