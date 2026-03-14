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
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [activeMovieId, setActiveMovieId] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState('');

  // Load watched movies
  useEffect(() => {
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  // Load reviews
  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await fetch('http://localhost:3001/reviews');
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error('Failed to fetch reviews', err);
        setReviews([]);
      }
    };
    getReviews();
  }, []);

  // Add review
  const addReview = async (movieId) => {
    if (!reviewText.trim()) return;

    const newReview = { movieId, review: reviewText };

    const res = await fetch('http://localhost:3001/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview),
    });

    const added = await res.json();
    setReviews([...reviews, added]);
    setReviewText('');
    setActiveMovieId(null);
  };

  // Delete review
  const deleteReview = async (id) => {
    await fetch(`http://localhost:3001/reviews/${id}`, {
      method: 'DELETE',
    });
    setReviews(reviews.filter(r => r.id !== id));
  };

  // Edit review
  const updateReview = async (id) => {
    if (!editText.trim()) return;

    const res = await fetch(`http://localhost:3001/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: editText }),
    });

    const updated = await res.json();
    setReviews(reviews.map(r => r.id === id ? updated : r));
    setEditingReviewId(null);
    setEditText('');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
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
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() => setActiveMovieId(movie.id)}
            >
              Add Review
            </Button>
            {activeMovieId === movie.id && (
              <Box sx={{ mt: 2, width: '100%' }}>
                <TextField
                  label="Write Review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => addReview(movie.id)}
                >
                  Submit Review
                </Button>
                <Button
                  sx={{ mt: 1, ml: 1 }}
                  onClick={() => setActiveMovieId(null)}
                >
                  Cancel
                </Button>
              </Box>
            )}
            {reviews?.filter(r => r.movieId === movie.id)?.map(r => (
              <Box key={r.id} sx={{ mt: 1, width: '100%' }}>
                {editingReviewId === r.id ? (
                  <>
                    <TextField
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      fullWidth
                    />
                    <Button sx={{ mt: 1 }} onClick={() => updateReview(r.id)}>Save</Button>
                    <Button sx={{ mt: 1, ml: 1 }} onClick={() => setEditingReviewId(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Typography>• {r.review}</Typography>
                    <Button size="small" onClick={() => { setEditingReviewId(r.id); setEditText(r.review); }}>Edit</Button>
                    <Button size="small" color="error" onClick={() => deleteReview(r.id)}>Delete</Button>
                  </>
                )}
              </Box>
            ))}

          </ListItem>
        ))}
      </List>
    </Box>
  );
}