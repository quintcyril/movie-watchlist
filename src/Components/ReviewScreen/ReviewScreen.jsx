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
  const [movieReviews, setMovieReviews] = useState([]);
  const [reviewInputs, setReviewInputs] = useState({});
  const [editingID, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  // Fetch movies
  useEffect(() => {
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(m => m.watched)));
  }, []);

  // // Fetch reviews
  useEffect(() => {
    fetch('http://localhost:3001/reviews')
      .then(res => res.json())
      .then(data => setMovieReviews(data));
  }, []);

  // Add review
  const handleAddReview = async (movieId) => {
    const text = reviewInputs[movieId];
    if (!text || !text.trim()) return;

    const res = await fetch('http://localhost:3001/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, reviewDesc: text })
    });

    const added = await res.json();

    setMovieReviews([...movieReviews, added]);
    setReviewInputs({ ...reviewInputs, [movieId]: '' });
  };

  // Start edit
  const handleStartEdit = (review) => {
    setEditingId(review.id);
    setEditDescription(review.reviewDesc);
  };

  // Update review
  const handleUpdateDescription = async (id) => {
    if (!editDescription.trim()) return;

    const res = await fetch(`http://localhost:3001/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewDesc: editDescription })
    });

    const updated = await res.json();

    setMovieReviews(movieReviews.map(r => r.id === id ? updated : r));

    setEditingId(null);
    setEditDescription('');
  };

  // Delete review
  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/reviews/${id}`, {
      method: 'DELETE'
    });

    setMovieReviews(movieReviews.filter(r => r.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDescription('');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>

      <List>
        {watchedMovies.map(movie => {
          const reviewsForMovie = movieReviews.filter(r => r.movieId === movie.id);

          return (
            <ListItem key={movie.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <ListItemText primary={movie.title} secondary={movie.genre} />

              {/* Add Review */}
              <TextField
                size="small"
                placeholder="Write a review..."
                value={reviewInputs[movie.id] || ''}
                onChange={(e) =>
                  setReviewInputs({
                    ...reviewInputs,
                    [movie.id]: e.target.value
                  })
                }
                sx={{ mt: 1 }}
              />

              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => handleAddReview(movie.id)}
              >
                Add Review
              </Button>

              {/* Reviews List */}
              {reviewsForMovie.map(review => (
                <Box key={review.id} sx={{ mt: 2, width: '100%' }}>
                  {editingID === review.id ? (
                    <>
                      <TextField
                        fullWidth
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <Button onClick={() => handleUpdateDescription(review.id)}>Save</Button>
                      <Button onClick={handleCancelEdit}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Typography>{review.reviewDesc}</Typography>
                      <Button onClick={() => handleStartEdit(review)}>Edit</Button>
                      <Button color="error" onClick={() => handleDelete(review.id)}>Delete</Button>
                    </>
                  )}
                </Box>
              ))}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}