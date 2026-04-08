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

  useEffect(() => {
    fetch('http://localhost:3001/movies')
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
      <Typography variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>

      <List>
        {watchedMovies.map(movie => (
          <ListItem
            key={movie.id}
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
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
