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
  const [newReview, setNewReview] = useState("");
  const [activeMovieId, setActiveMovieId] = useState(null);

  useEffect(() => { fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  const addReview = (movieID) => {
    if (!newReview.trim()) return;

    setReviews(prev => ({
      ...prev,
      [movieID]: [...(prev[movieID] || []), newReview]
    }));

    setNewReview("");
    setActiveMovieId(null);
  };

  const editReview = (movieID, index) => {
    const updatedReviewText = prompt("Edit your movie review:");
    if (!updatedReviewText) return;

    const updatedReviews = [...(reviews[movieID] || [])];
    updatedReviews[index] = updatedReviewText;

    setReviews(prev => ({
      ...prev,
      [movieID]: updatedReviews
    }));
  };

  const deleteReview = (movieID, index) => {
    const updatedReviews = reviews[movieID].filter((_, i) => i !== index);

    setReviews(prev => ({
      ...prev,
      [movieID]: updatedReviews
    }));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: '#45ADED', borderRadius: 2, boxShadow: 3 }}>
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
            {reviews[movie.id]?.map((review, index) => (
              <Box key={index} sx={{ width: '100%', mt: 1 }}>
                <Typography variant="body2">{review}</Typography>

                <Button size="small" onClick={() => editReview(movie.id, index)}>
                  Edit
                </Button>

                <Button size="small" color="error" onClick={() => deleteReview(movie.id, index)}>
                  Delete
                </Button>
              </Box>
            ))}

            {activeMovieId === movie.id ? (
              <Box sx={{ width: '100%', mt: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Write a review"
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                />

                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => addReview(movie.id)}
                >
                  Submit Review
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => setActiveMovieId(movie.id)}
              >
                Add Review
              </Button>
            )}

          </ListItem>
        ))}
      </List>
    </Box>
  );
}
