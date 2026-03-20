import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/movies')
      .then((res) => res.json())
      .then((data) => setWatchedMovies(data.filter((movie) => movie.watched)));

    fetch('http://localhost:3001/reviews')
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  const getReviewForMovie = (movieId) => reviews.find((r) => r.movieId === movieId) || null;

  const setDraft = (movieId, value) => {
    setDrafts((prev) => ({ ...prev, [movieId]: value }));
  };

  const saveReview = async (movie) => {
    const existing = getReviewForMovie(movie.id);
    const body = { movieId: movie.id, review: (drafts[movie.id] ?? '').trim() };

    if (!body.review) return;

    if (existing) {
      const res = await fetch(`http://localhost:3001/reviews/${existing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review: body.review }),
      });
      const updated = await res.json();
      setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } else {
      const res = await fetch('http://localhost:3001/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const created = await res.json();
      setReviews((prev) => [...prev, created]);
    }

    setEditingReview(null);
    setDrafts((prev) => ({ ...prev, [movie.id]: '' }));
  };

  const deleteReview = async (movie) => {
    const existing = getReviewForMovie(movie.id);
    if (!existing) return;

    await fetch(`http://localhost:3001/reviews/${existing.id}`, {
      method: 'DELETE',
    });

    setReviews((prev) => prev.filter((r) => r.id !== existing.id));
    setEditingReview(null);
    setDrafts((prev) => ({ ...prev, [movie.id]: '' }));
  };

  const editReview = (movie) => {
    const existing = getReviewForMovie(movie.id);
    setEditingReview(movie.id);
    setDrafts((prev) => ({ ...prev, [movie.id]: existing?.review || '' }));
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>

      {watchedMovies.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
          No watched movies yet. Mark movies as watched on the watchlist to leave reviews.
        </Typography>
      ) : (
        <List>
          {watchedMovies.map((movie) => {
            const existing = getReviewForMovie(movie.id);
            const isEditing = editingReview === movie.id;
            const editValue = drafts[movie.id] ?? '';

            return (
              <ListItem
                key={movie.id}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  p: 2,
                  mb: 1,
                  border: '1px solid #ddd',
                  borderRadius: 2,
                }}
              >
                <ListItemText primary={movie.title} secondary={movie.genre} sx={{ mb: 1 }} />

                {existing && !isEditing && (
                  <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                    {existing.review}
                  </Typography>
                )}

                {(isEditing || !existing) && (
                  <TextField
                    label={existing ? 'Edit your review' : 'Add a review'}
                    multiline
                    minRows={3}
                    fullWidth
                    value={editValue}
                    onChange={(e) => setDraft(movie.id, e.target.value)}
                    sx={{ mb: 1 }}
                  />
                )}

                <Stack direction="row" spacing={1}>
                  {isEditing ? (
                    <>
                      <Button variant="contained" color="primary" onClick={() => saveReview(movie)}>
                        Save
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={() => setEditingReview(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : existing ? (
                    <>
                      <Button variant="contained" color="primary" onClick={() => editReview(movie)}>
                        Edit Review
                      </Button>
                      <Button variant="outlined" color="error" onClick={() => deleteReview(movie)}>
                        Delete Review
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => saveReview(movie)}
                      disabled={!editValue.trim()}
                    >
                      Add Review
                    </Button>
                  )}
                </Stack>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}

