import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const API = 'http://localhost:3001';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState("");
  const [activeMovieId, setActiveMovieId] = useState(null);
  const [editingKey, setEditingKey] = useState(null); // "movieId-index"
  const [editText, setEditText] = useState("");

  // Fetch watched movies and all persisted reviews on mount
  useEffect(() => {
    fetch(`${API}/movies`)
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));

    fetch(`${API}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  const addReview = async (movieID) => {
    if (!newReview.trim()) return;

    const res = await fetch(`${API}/reviews/${movieID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newReview })
    });
    const updated = await res.json();
    setReviews(prev => ({ ...prev, [movieID]: updated }));
    setNewReview("");
    setActiveMovieId(null);
  };

  const startEdit = (movieID, index) => {
    setEditingKey(`${movieID}-${index}`);
    setEditText(reviews[movieID][index]);
  };

  const saveEdit = async (movieID, index) => {
    if (!editText.trim()) return;

    const res = await fetch(`${API}/reviews/${movieID}/${index}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editText })
    });
    const updated = await res.json();
    setReviews(prev => ({ ...prev, [movieID]: updated }));
    setEditingKey(null);
    setEditText("");
  };

  const deleteReview = async (movieID, index) => {
    const res = await fetch(`${API}/reviews/${movieID}/${index}`, {
      method: 'DELETE'
    });
    const updated = await res.json();
    setReviews(prev => ({ ...prev, [movieID]: updated }));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: '#45ADED', borderRadius: 2, boxShadow: 3 }}>
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

            {(reviews[movie.id] || []).map((review, index) => (
              <Box key={index} sx={{ width: '100%', mt: 1 }}>
                {editingKey === `${movie.id}-${index}` ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="contained" size="small" onClick={() => saveEdit(movie.id, index)}>
                        Save
                      </Button>
                      <Button variant="outlined" size="small" onClick={() => setEditingKey(null)}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>{review}</Typography>
                    <Button size="small" onClick={() => startEdit(movie.id, index)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => deleteReview(movie.id, index)}>
                      Delete
                    </Button>
                  </Box>
                )}
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
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
