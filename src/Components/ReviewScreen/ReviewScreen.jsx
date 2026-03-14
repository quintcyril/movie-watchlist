import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCommentIcon from '@mui/icons-material/AddComment';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [showAddFor, setShowAddFor] = useState(null);
  const [addText, setAddText] = useState({});

  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState("");

  // Load watched movies
  useEffect(() => {
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  // Load reviews from reviews.json
  const loadReviews = async () => {
    try {
      const res = await fetch('http://localhost:3001/reviews');
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      setReviews([]);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Save new review
  const handleSaveNewReview = async (movieId) => {
    const text = (addText[movieId] || '').trim();
    if (!text) return;

    await fetch('http://localhost:3001/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId: movieId, text: text }),
    });

    setAddText(prev => ({ ...prev, [movieId]: '' }));
    setShowAddFor(null);

    loadReviews();
  };

  const handleCancelAdd = (movieId) => {
    setAddText(prev => ({ ...prev, [movieId]: '' }));
    setShowAddFor(null);
  };

  // Start editing
  const handleStartEdit = (review) => {
    setEditingReview(review.id);
    setEditText(review.text);
  };

  // Save edit
  const handleSaveEdit = async (reviewId) => {
    await fetch(`http://localhost:3001/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editText }),
    });

    setEditingReview(null);
    setEditText('');

    loadReviews();
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditText('');
  };

  // pang delete review
  const handleDeleteReview = async (reviewId) => {
    await fetch(`http://localhost:3001/reviews/${reviewId}`, { method: 'DELETE' });
    loadReviews();
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>

      <Grid container spacing={2}>
        {watchedMovies.map(movie => {
          const movieReviews = reviews.filter(r => Number(r.movieId) === Number(movie.id));
          return (
            <Grid item xs={12} md={6} key={movie.id}>
              <Card elevation={3}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>{(movie.title || '').charAt(0)}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{movie.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{movie.genre}</Typography>
                    </Box>
                    <Tooltip title="Add review">
                      <IconButton color="primary" onClick={() => setShowAddFor(movie.id)}>
                        <AddCommentIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  {movieReviews.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No reviews yet</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {movieReviews.map(review => (
                        <Box key={review.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32 }}>{(review.text || '').charAt(0)}</Avatar>
                          <Box sx={{ flex: 1 }}>
                            {editingReview === review.id ? (
                              <Stack direction="row" spacing={1}>
                                <TextField size="small" fullWidth value={editText} onChange={(e) => setEditText(e.target.value)} />
                                <Button variant="contained" onClick={() => handleSaveEdit(review.id)}>Save</Button>
                                <Button variant="outlined" onClick={handleCancelEdit}>Cancel</Button>
                              </Stack>
                            ) : (
                              <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography>{review.text}</Typography>
                                <Box>
                                  <IconButton size="small" onClick={() => handleStartEdit(review)}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" color="error" onClick={() => handleDeleteReview(review.id)}>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Stack>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}

                  {showAddFor === movie.id && (
                    <Box sx={{ mt: 2 }}>
                      <Stack direction="row" spacing={1}>
                        <TextField size="small" placeholder="Write a review..." fullWidth value={addText[movie.id] || ''} onChange={(e) => setAddText(prev => ({ ...prev, [movie.id]: e.target.value }))} />
                        <Button variant="contained" onClick={() => handleSaveNewReview(movie.id)}>Save</Button>
                        <Button variant="outlined" onClick={() => handleCancelAdd(movie.id)}>Cancel</Button>
                      </Stack>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>Click edit to modify a review.</Typography>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
