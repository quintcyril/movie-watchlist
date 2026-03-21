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
  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    // Retrieve watched movies from backend
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  // TODO: Implement add review functionality for watched movies
  const handleAddReview = (movieId) => {
    const text = reviewInputs[movieId];
    if (!text) return;

    const movie = watchedMovies.find(m => m.id === movieId);
    const updatedReviews = movie.reviews
      ? [...movie.reviews, { id: Date.now(), text }]
      : [{ id: Date.now(), text }];

    fetch(`http://localhost:3001/movies/${movieId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviews: updatedReviews })
    }).then(() => {
      setWatchedMovies(prev =>
        prev.map(m =>
          m.id === movieId ? { ...m, reviews: updatedReviews } : m
        )
      );
      setReviewInputs({ ...reviewInputs, [movieId]: "" });
    });
  };

  // TODO: Implement edit/delete review functionality
  const handleDeleteReview = (movieId, reviewId) => {
    const movie = watchedMovies.find(m => m.id === movieId);
    const updatedReviews = movie.reviews.filter(r => r.id !== reviewId);

    fetch(`http://localhost:3001/movies/${movieId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviews: updatedReviews })
    }).then(() => {
      setWatchedMovies(prev =>
        prev.map(m =>
          m.id === movieId ? { ...m, reviews: updatedReviews } : m
        )
      );
    });
  };

   const handleEditReview = (review) => {
    setEditingReview(review.id);
    setEditText(review.text);
  };

   const handleSaveEdit = (movieId) => {
    const movie = watchedMovies.find(m => m.id === movieId);

    const updatedReviews = movie.reviews.map(r =>
      r.id === editingReview ? { ...r, text: editText } : r
    );

    fetch(`http://localhost:3001/movies/${movieId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviews: updatedReviews })
    }).then(() => {
      setWatchedMovies(prev =>
        prev.map(m =>
          m.id === movieId ? { ...m, reviews: updatedReviews } : m
        )
      );
      setEditingReview(null);
      setEditText("");
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
            {movie.reviews && movie.reviews.map(review => (
              <Box key={review.id} sx={{ width: '100%', mb: 1 }}>
               
                {editingReview === review.id ? (
                  <>
                    <TextField
                      fullWidth
                      size="small"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 1, mr: 1 }}
                      onClick={() => handleSaveEdit(movie.id)}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="body2">{review.text}</Typography>
                    <Button
                      size="small"
                      onClick={() => handleEditReview(review)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteReview(movie.id, review.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}

              </Box>
            ))}

            <TextField
              fullWidth
              size="small"
              placeholder="Write a review..."
              value={reviewInputs[movie.id] || ""}
              onChange={(e) =>
                setReviewInputs({
                  ...reviewInputs,
                  [movie.id]: e.target.value
                })
              }
              sx={{ mt: 1 }}
            />

            <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => handleAddReview(movie.id)}>
              Add Review {/* TODO: Implement add review for this movie */}
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
