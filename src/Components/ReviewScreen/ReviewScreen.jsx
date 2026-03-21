import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './ReviewScreen.css';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  // reviews: { [movieId]: Review[] }
  const [reviews, setReviews] = useState({});
  // forms: { [movieId]: { reviewText, rating } } — for the add-review form per movie
  const [forms, setForms] = useState({});
  // editingReview: { id, movieId, reviewText, rating } | null
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => {
        const watched = data.filter(movie => movie.watched);
        setWatchedMovies(watched);
        watched.forEach(movie => fetchReviews(movie.id));
      });
  }, []);

  const fetchReviews = (movieId) => {
    fetch(`http://localhost:3001/reviews?movieId=${movieId}`)
      .then(res => res.json())
      .then(data => setReviews(prev => ({ ...prev, [movieId]: data })));
  };

  const handleFormChange = (movieId, field, value) => {
    setForms(prev => ({
      ...prev,
      [movieId]: { ...prev[movieId], [field]: value },
    }));
  };

  const handleAddReview = (movieId) => {
    const form = forms[movieId] || {};
    if (!form.reviewText?.trim()) return;
    fetch('http://localhost:3001/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, reviewText: form.reviewText, rating: form.rating || null }),
    })
      .then(res => res.json())
      .then(() => {
        setForms(prev => ({ ...prev, [movieId]: { reviewText: '', rating: 0 } }));
        fetchReviews(movieId);
      });
  };

  const handleEditSave = () => {
    if (!editingReview || !editingReview.reviewText?.trim()) return;
    fetch(`http://localhost:3001/reviews/${editingReview.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewText: editingReview.reviewText, rating: editingReview.rating }),
    })
      .then(res => res.json())
      .then(() => {
        fetchReviews(editingReview.movieId);
        setEditingReview(null);
      });
  };

  const handleDelete = (review, movieId) => {
    fetch(`http://localhost:3001/reviews/${review.id}`, { method: 'DELETE' })
      .then(() => fetchReviews(movieId));
  };

  return (
    <div className="review-screen">
      <div className="review-screen__halo" />
      <Box className="review-panel">
        <Typography variant="h4" className="review-title">
          Movie Review Hub
        </Typography>
        <Typography className="review-subtitle">
          Share your thoughts on the films you already watched.
        </Typography>

        {watchedMovies.length === 0 && (
          <Typography className="review-empty">No watched movies yet.</Typography>
        )}

        <div className="review-movie-grid">
          {watchedMovies.map(movie => (
            <article key={movie.id} className="review-movie-card">
              <header className="review-movie-header">
                <Typography variant="h6" className="review-movie-title">{movie.title}</Typography>
                <span className="review-genre-pill">{movie.genre}</span>
              </header>

              <div className="review-list">
                {(reviews[movie.id] || []).map(review =>
                  editingReview?.id === review.id ? (
                    <Box key={review.id} className="review-item review-item--editing">
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label="Edit review"
                        value={editingReview.reviewText}
                        onChange={e => setEditingReview(prev => ({ ...prev, reviewText: e.target.value }))}
                        size="small"
                      />
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                        <Typography variant="body2">Rating:</Typography>
                        <Rating
                          value={editingReview.rating || 0}
                          onChange={(_, val) => setEditingReview(prev => ({ ...prev, rating: val }))}
                        />
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button size="small" variant="contained" onClick={handleEditSave}>Save</Button>
                        <Button size="small" variant="outlined" onClick={() => setEditingReview(null)}>Cancel</Button>
                      </Stack>
                    </Box>
                  ) : (
                    <Box key={review.id} className="review-item">
                      <div className="review-item__content">
                        <Typography variant="body2">{review.reviewText}</Typography>
                        {review.rating && <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.5 }} />}
                      </div>
                      <Stack direction="row">
                        <IconButton
                          size="small"
                          onClick={() => setEditingReview({ ...review, movieId: movie.id })}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(review, movie.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  )
                )}
              </div>

              <Box className="review-form">
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Write a review"
                  value={forms[movie.id]?.reviewText || ''}
                  onChange={e => handleFormChange(movie.id, 'reviewText', e.target.value)}
                  size="small"
                />
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="body2">Rating:</Typography>
                  <Rating
                    value={forms[movie.id]?.rating || 0}
                    onChange={(_, val) => handleFormChange(movie.id, 'rating', val)}
                  />
                </Stack>
                <Button
                  variant="contained"
                  className="review-submit-btn"
                  sx={{ mt: 1 }}
                  onClick={() => handleAddReview(movie.id)}
                  disabled={!forms[movie.id]?.reviewText?.trim()}
                >
                  Add Review
                </Button>
              </Box>
            </article>
          ))}
        </div>
      </Box>
    </div>
  );
}
