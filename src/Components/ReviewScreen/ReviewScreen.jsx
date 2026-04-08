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
  const [reviewInputs, setReviewInputs] = useState({});
  const [editingMovieId, setEditingMovieId] = useState(null);

<<<<<<< HEAD
  useEffect(() => {
    fetch('http://localhost:3001/movies')
=======
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState("");
  const [activeMovieId, setActiveMovieId] = useState(null);

  useEffect(() => { fetch('http://localhost:3001/movies')
>>>>>>> 3a7f7cd6c5e31a732c4bde45aceede3321fd54bd
      .then(res => res.json())
      .then(data => {
        const watched = data.filter(movie => movie.watched);
        setWatchedMovies(watched);

        const initialInputs = {};
        watched.forEach(movie => {
          initialInputs[movie.id] = movie.review || '';
        });
        setReviewInputs(initialInputs);
      });
  }, []);

<<<<<<< HEAD
  const handleInputChange = (movieId, value) => {
    setReviewInputs(prev => ({
      ...prev,
      [movieId]: value
    }));
  };

  const saveReview = async (movie) => {
    const updatedMovie = {
      ...movie,
      review: reviewInputs[movie.id] || ''
    };

    try {
      const res = await fetch(`http://localhost:3001/movies/${movie.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMovie)
      });

      if (!res.ok) throw new Error('Failed to save review');

      setWatchedMovies(prev =>
        prev.map(m => (m.id === movie.id ? updatedMovie : m))
      );
      setEditingMovieId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const editReview = (movieId) => {
    setEditingMovieId(movieId);
  };

  const deleteReview = async (movie) => {
    const updatedMovie = {
      ...movie,
      review: ''
    };

    try {
      const res = await fetch(`http://localhost:3001/movies/${movie.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMovie)
      });

      if (!res.ok) throw new Error('Failed to delete review');

      setWatchedMovies(prev =>
        prev.map(m => (m.id === movie.id ? updatedMovie : m))
      );

      setReviewInputs(prev => ({
        ...prev,
        [movie.id]: ''
      }));

      setEditingMovieId(null);
    } catch (error) {
      console.error(error);
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
=======
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
>>>>>>> 3a7f7cd6c5e31a732c4bde45aceede3321fd54bd
      <Typography variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>

      <List>
        {watchedMovies.map(movie => (
          <ListItem
            key={movie.id}
<<<<<<< HEAD
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              mb: 3,
              borderBottom: '1px solid #ddd'
            }}
          >
            <ListItemText primary={movie.title} secondary={movie.genre} />

            {movie.review && editingMovieId !== movie.id && (
              <Typography sx={{ mb: 1 }}>
                <strong>Review:</strong> {movie.review}
              </Typography>
            )}

            {(editingMovieId === movie.id || !movie.review) && (
              <TextField
                fullWidth
                label="Write your review"
                variant="outlined"
                size="small"
                value={reviewInputs[movie.id] || ''}
                onChange={(e) => handleInputChange(movie.id, e.target.value)}
                sx={{ mt: 1 }}
              />
            )}

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {(editingMovieId === movie.id || !movie.review) ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => saveReview(movie)}
                >
                  Save Review
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => editReview(movie.id)}
                >
                  Edit Review
                </Button>
              )}

              {movie.review && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => deleteReview(movie)}
                >
                  Delete Review
                </Button>
              )}
            </Box>
=======
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

>>>>>>> 3a7f7cd6c5e31a732c4bde45aceede3321fd54bd
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
