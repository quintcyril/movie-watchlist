import React, { useEffect, useState } from 'react';
import {
  Box, Typography, List, ListItem,
  ListItemText, Button, TextField
} from '@mui/material';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState({});
  const [editing, setEditing] = useState({}); // track edit mode
  const [editText, setEditText] = useState({}); // track edit input

  useEffect(() => {
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(m => m.watched)));

    fetch('http://localhost:3001/reviews')
      .then(res => res.json())
      .then(data => {
        const grouped = {};
        data.forEach(r => {
          if (!grouped[r.movieId]) grouped[r.movieId] = [];
          grouped[r.movieId].push(r);
        });
        setReviews(grouped);
      });
  }, []);

  const handleAddReview = (movieId) => {
    if (!newReview[movieId]) return;

    fetch('http://localhost:3001/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, review: newReview[movieId] })
    })
      .then(res => res.json())
      .then(data => {
        setReviews(prev => ({
          ...prev,
          [movieId]: [...(prev[movieId] || []), data]
        }));
        setNewReview(prev => ({ ...prev, [movieId]: '' }));
      });
  };

  const handleDelete = (id, movieId) => {
    fetch(`http://localhost:3001/reviews/${id}`, {
      method: 'DELETE'
    }).then(() => {
      setReviews(prev => ({
        ...prev,
        [movieId]: prev[movieId].filter(r => r.id !== id)
      }));
    });
  };

  const handleSaveEdit = (id, movieId) => {
    const updatedText = editText[id];

    fetch(`http://localhost:3001/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: updatedText })
    }).then(() => {
      setReviews(prev => ({
        ...prev,
        [movieId]: prev[movieId].map(r =>
          r.id === id ? { ...r, review: updatedText } : r
        )
      }));
      setEditing(prev => ({ ...prev, [id]: false }));
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

            {/* Reviews */}
            {(reviews[movie.id] || []).map(r => (
              <Box key={r.id} sx={{ width: '100%', mb: 1 }}>
                {editing[r.id] ? (
                  <>
                    <TextField
                      fullWidth
                      size="small"
                      value={editText[r.id]}
                      onChange={(e) =>
                        setEditText({ ...editText, [r.id]: e.target.value })
                      }
                    />
                    <Button
                      size="small"
                      onClick={() => handleSaveEdit(r.id, movie.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        setEditing(prev => ({ ...prev, [r.id]: false }))
                      }
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography>{r.review}</Typography>
                    <Button
                      size="small"
                      onClick={() => {
                        setEditing(prev => ({ ...prev, [r.id]: true }));
                        setEditText(prev => ({ ...prev, [r.id]: r.review }));
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleDelete(r.id, movie.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            ))}

            {/* Add Review */}
            <TextField
              fullWidth
              size="small"
              placeholder="Write a review..."
              value={newReview[movie.id] || ''}
              onChange={(e) =>
                setNewReview({ ...newReview, [movie.id]: e.target.value })
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
          </ListItem>
        ))}
      </List>
    </Box>
  );
}