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
  const [editingIndex, setEditingIndex] = useState({});
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    // Retrieve watched movies from backend
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  // TODO: Implement add review functionality for watched movies

  const handleAddReview = (movieId) => {
    if (!newReview[movieId]) return;

    setReviews(prev => ({
      ...prev,
      [movieId]: [...(prev[movieId] || []), newReview[movieId]]
    }));

    setNewReview(prev => ({ ...prev, [movieId]: '' }));
  };

  // TODO: Implement edit/delete review functionality

  const handleDeleteReview = (movieId, index) => {
  setReviews(prev => ({
    ...prev,
    [movieId]: prev[movieId].filter((_, i) => i !== index)
  }));
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
            <Button variant="contained" color="primary" sx={{ mt: 1 }}>
              Add Review {/* TODO: Implement add review for this movie */}
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
