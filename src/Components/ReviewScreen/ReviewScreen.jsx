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
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  // Handle input change
  const handleInputChange = (id, value) => {
    setReviewInputs(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // ADD or UPDATE review
  const handleSaveReview = (movie) => {
    const updatedMovie = {
      ...movie,
      review: reviewInputs[movie.id] || ''
    };

    fetch(`http://localhost:3001/movies/${movie.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMovie)
    })
      .then(res => res.json())
      .then(() => {
        setWatchedMovies(prev =>
          prev.map(m => (m.id === movie.id ? updatedMovie : m))
        );
        setEditingId(null);
      });
  };

  // DELETE review
  const handleDeleteReview = (movie) => {
    const updatedMovie = {
      ...movie,
      review: ''
    };

    fetch(`http://localhost:3001/movies/${movie.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMovie)
    })
      .then(res => res.json())
      .then(() => {
        setWatchedMovies(prev =>
          prev.map(m => (m.id === movie.id ? updatedMovie : m))
        );
      });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>

      <List>
        {watchedMovies.map(movie => (
          <ListItem key={movie.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <ListItemText primary={movie.title} secondary={movie.genre} />

            {/* SHOW REVIEW */}
            {movie.review && editingId !== movie.id && (
              <Typography sx={{ mt: 1 }}>
                <strong>Review:</strong> {movie.review}
              </Typography>
            )}

            {/* INPUT FIELD */}
            {editingId === movie.id && (
              <TextField
                fullWidth
                label="Write your review"
                value={reviewInputs[movie.id] || ''}
                onChange={(e) => handleInputChange(movie.id, e.target.value)}
                sx={{ mt: 1 }}
              />
            )}

            {/* BUTTONS */}
            {editingId === movie.id ? (
              <>
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => handleSaveReview(movie)}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    setEditingId(movie.id);
                    setReviewInputs(prev => ({
                      ...prev,
                      [movie.id]: movie.review || ''
                    }));
                  }}
                >
                  {movie.review ? 'Edit Review' : 'Add Review'}
                </Button>

                {movie.review && (
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={() => handleDeleteReview(movie)}
                  >
                    Delete Review
                  </Button>
                )}
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}