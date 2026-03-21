import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviews, setReviews] = useState({});
  const [savedReviews, setSavedReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  useEffect(() => {
    // Retrieve watched movies from backend
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
   
      fetch ('http://localhost:3001/reviews')
      .then(res => res.json())
      .then(result => {
        if (result.success) setSavedReviews(result.data);
      })
    }, []);

    const getSavedReview = (movieId) =>
      savedReviews.find(r => r.movieId===movieId);

  // TODO: Implement add review functionality for watched movies
  const handleReviewChange = (movieId, value) => {
    setReviews({
      ...reviews,[movieId]:value
    });
  }

  const handleAddReview = (movieId) => {
    const reviewText = reviews[movieId];
    if (!reviewText) return;

    fetch('http://localhost:3001/reviews',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({movieId, review: reviewText }),
    })
      .then(res => res.json())
      .then(result => {
        if(!result.success) return;
        setSavedReviews(prev => [...prev, result.data]);
        setReviews(prev => {
          const next = {...prev};
          delete next[movieId];
          return next;
        });
      });
  }
  // TODO: Implement edit/delete review functionality
const handleSaveEdit = (reviewId, movieId) => {
    const reviewText = reviews[movieId];
    if (!reviewText) return;

    fetch(`http://localhost:3001/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: reviewText }),
    })
      .then(res => res.json())
      .then(result => {
        if (!result.success) return;
        setSavedReviews(prev =>
          prev.map(r => (r.id === reviewId ? result.data : r))
        );
        setReviews(prev => { const next = { ...prev }; delete next[movieId]; return next; });
        setEditingId(null);
      });
  };

 const handleDeleteReview = (reviewId, movieId) => {
    fetch(`http://localhost:3001/reviews/${reviewId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(result => {
        if (!result.success) return;
        setSavedReviews(prev => prev.filter(r => r.id !== reviewId));
        setReviews(prev => { const next = { ...prev }; delete next[movieId]; return next; });
        setEditingId(null);
      });
  };

  const handleStartEdit = (review) => {
    setEditingId(review.id);
    setReviews(prev => ({ ...prev, [review.movieId]: review.review }));
  };

  const handleCancelEdit = (movieId) => {
    setEditingId(null);
    setReviews(prev => { const next = { ...prev }; delete next[movieId]; return next; });
  };


  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>
      <List>
        {watchedMovies.map(movie => {
          const existing = getSavedReview(movie.id);
          const isEditing = existing && editingId === existing.id;
      
          return(
          <ListItem key={movie.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <ListItemText primary={movie.title} secondary={movie.genre} />
          
             {existing && !isEditing && (
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                  Your review: "{existing.review}"
                </Typography>
              )}

              {(!existing || isEditing) && (
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  placeholder="Write your review..."
                  value={reviews[movie.id] || ''}
                  onChange={e => handleReviewChange(movie.id, e.target.value)}
                  sx={{ mt: 1 }}
                />
              )}

             <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {/* TODO: Add review form and display reviews for this movie */}
                {!existing && (
                  <Button variant="contained" color="primary" size="small"
                    disabled={!reviews[movie.id]}
                    onClick={() => handleAddReview(movie.id)}>
                  Add Review {/* TODO: Implement add review for this movie */}
                  </Button>
                )}

                 {isEditing && (
                  <Button variant="contained" color="primary" size="small"
                    disabled={!reviews[movie.id]}
                    onClick={() => handleSaveEdit(existing.id, movie.id)}
                  >
                    Save
                  </Button>
                )}
                 {isEditing && (
                  <Button variant="outlined" size="small" onClick={() => handleCancelEdit(movie.id)}>
                    Cancel
                  </Button>
                )}
                {existing && !isEditing && (
                  <Button variant="outlined" size="small" onClick={() => handleStartEdit(existing)}>
                    Edit
                  </Button>
                )}
                {existing && (
                  <Button variant="outlined" color="error" size="small"
                    onClick={() => handleDeleteReview(existing.id, movie.id)}
                  >
                    Delete
                  </Button>
                )}
              </Stack>
          </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
