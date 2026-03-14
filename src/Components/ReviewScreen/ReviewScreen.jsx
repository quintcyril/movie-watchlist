import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState({}); // keyed by movieId
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const moviesRes = await fetch('http://localhost:3001/movies');
      const moviesData = await moviesRes.json();
      console.log('movies fetched:', moviesData);
      setWatchedMovies(Array.isArray(moviesData) ? moviesData.filter(m => m.watched) : []);
    } catch (err) {
      console.error('movies fetch error:', err);
      setWatchedMovies([]);
    }

    try {
      const reviewsRes = await fetch('http://localhost:3001/reviews');
      const reviewsData = await reviewsRes.json();
      console.log('reviews fetched:', reviewsData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error('reviews fetch error:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNewReviewChange = (movieId, value) => {
    setNewReviewText(prev => ({ ...prev, [movieId]: value }));
  };

  const handleAddReview = async (movieId) => {
    const text = (newReviewText[movieId] || '').trim();
    if (!text) return;
    const payload = { id: Date.now(), movieId, text };

    try {
      const res = await fetch('http://localhost:3001/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const added = await res.json();
      setReviews(prev => [...prev, added]);
    } catch {
      setReviews(prev => [...prev, payload]); // fallback
    }

    setNewReviewText(prev => ({ ...prev, [movieId]: '' }));
  };

  const handleStartEdit = (review) => {
    setEditingReviewId(review.id);
    setEditReviewText(review.text);
  };

  const handleUpdateReview = async (id) => {
    const text = editReviewText.trim();
    if (!text) return;

    try {
      const res = await fetch(`http://localhost:3001/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const updated = await res.json();
      setReviews(prev => prev.map(r => (r.id === id ? updated : r)));
    } catch {
      setReviews(prev => prev.map(r => (r.id === id ? { ...r, text } : r)));
    }

    setEditingReviewId(null);
    setEditReviewText('');
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditReviewText('');
  };

  const handleDeleteReview = async (id) => {
    try {
      await fetch(`http://localhost:3001/reviews/${id}`, { method: 'DELETE' });
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
    if (editingReviewId === id) handleCancelEdit();
  };

  // Minimal UI when there are no watched movies — helpful for debugging / visibility
  if (loading) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3 }}>
        <Typography align="center">Loading reviews...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>

      {watchedMovies.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" gutterBottom>No watched movies found.</Typography>
          <Typography variant="body2" gutterBottom>
            Either no movies are marked as watched, or the backend is unreachable.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Button variant="contained" onClick={() => (window.location.href = '/')}>Go to Watchlist</Button>
            <Button variant="outlined" onClick={loadData}>Refresh</Button>
          </Box>
          {/* show any existing reviews (debug) */}
          {reviews.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Existing reviews (no watched movies matched):</Typography>
              <List>
                {reviews.map(r => (
                  <ListItem key={r.id}>
                    <ListItemText primary={r.text} secondary={`movieId: ${r.movieId}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      ) : (
        <List>
          {watchedMovies.map(movie => {
            const movieReviews = reviews.filter(r => r.movieId === movie.id);
            return (
              <ListItem key={movie.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                <ListItemText primary={movie.title} secondary={movie.genre} />
                {movieReviews.map(r => (
                  <Box key={r.id} sx={{ width: '100%', pl: 1, pt: 1 }}>
                    {editingReviewId === r.id ? (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
                        <input
                          style={{ flex: 1, padding: '6px 8px' }}
                          value={editReviewText}
                          onChange={(e) => setEditReviewText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleUpdateReview(r.id)}
                        />
                        <Button variant="contained" onClick={() => handleUpdateReview(r.id)}>Save</Button>
                        <Button variant="outlined" onClick={handleCancelEdit}>Cancel</Button>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Typography variant="body2" sx={{ pr: 2 }}>{r.text}</Typography>
                        <Box>
                          <Button size="small" onClick={() => handleStartEdit(r)}>Edit</Button>
                          <Button size="small" color="error" onClick={() => handleDeleteReview(r.id)}>Delete</Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}

                <Box sx={{ mt: 1, display: 'flex', gap: 1, width: '100%' }}>
                  <input
                    placeholder="Write a review..."
                    style={{ flex: 1, padding: '6px 8px' }}
                    value={newReviewText[movie.id] || ''}
                    onChange={(e) => handleNewReviewChange(movie.id, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddReview(movie.id)}
                  />
                  <Button variant="contained" onClick={() => handleAddReview(movie.id)}>Add Review</Button>
                </Box>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}
