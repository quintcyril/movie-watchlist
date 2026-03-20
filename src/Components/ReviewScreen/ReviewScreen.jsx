import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField  from '@mui/material/TextField'; 

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviews, setReviews] = useState({}); // { movieId: [{ id, text }] }
  const [reviewInputs, setReviewInputs] = useState(''); // For new review input

  useEffect(() => {
    // Retrieve watched movies from backend
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  // TODO: Implement add review functionality for watched movies
  const handleAddReview = (movieId) => {
    const text =  reviewInputs[movieId];

    if ( !text || text.trim() === '') 
      return; //backend logic here to add review for movieId

    const newReview = {
      id: Date.now(),
      text: text
    }; 

    setReviews({
      ...prev,
      [movieId]: [...(reviews[movieId] || []),text ]
    });

    setReviewInputs({
      ...reviewInputs,
      [movieId]: '' // Clear input after adding review
    });
  };
 
  const handleEditReview = (movieId, reviewId, oldText) => {
    const newText = prompt('Edit your review:', oldText);

    if (!newText || newText.trim() === ''){
      return;
    }

    const updatedReviews = (reviews[movieId] || []).map(review =>{
      if (review.id === reviewId) {
        return { ...review, text: newText };
      }
      return review;
    });

    setReviews({
      ...reviews,
      [movieId]: updatedReviews
    });
  };


  const handleDeleteReview = (reviewId) => {
    const updatedReviews = (reviews[movieId] || []).filter(
      review => review.id !== reviewId);

    setReviews({
      ...reviews,
      [movieId]: updatedReviews
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
            {/* TODO: Add review form and display reviews for this movie */}
            <TextField
              label="Write a review"
              variant="outlined"
              fullWidth
              onChange={(e) => setReviewInputs({ 
                ...reviewInputs, [movie.id]: e.target.value 
              })}
              value={reviewInputs[movie.id] || ''}
              />
            <Button variant="contained" color="primary" sx={{ mt: 1 }}
              onClick={() => handleAddReview(movie.id)}
            >
              Add Review {/* TODO: Implement add review for this movie */}
            </Button>
            <Box sx={{ mt: 2, width: '100%' }}>
              {(reviews[movie.id] || []).map((review, index) => (
                <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                  {review.text}
                </Typography>
              ))}
              </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
