import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviewsMap, setReviewsMap] = useState([]);
  const [addingReviewFor, setAddingReviewFor] = useState({});
  const [newReviewText, setNewReviewText] = useState({});
  const [editingReview, setEditingReview] = useState({});

  useEffect(() => {
      // Retrieve watched movies from backend
      fetch('http://localhost:3001/movies')
        .then(res => res.json())
        .then(data => {
          const watched = data.filter(movie => movie.watched)
          setWatchedMovies(watched);
          watched.forEach(movie => fetchReviews(movie.id));
        })
        .catch(err => console.error(`Failed to fetch movies`, err));
    }, []);
  
    const fetchReviews = (movieID) => {
      fetch(`http://localhost:3001/movies/${movieID}/reviews`)
      .then (res => res.json)
      .then (reviews => 
        setReviewsMap(prev => ({...prev, [movieID]: reviews}))
      )
      .catch(err => console.error(`Failed to fetch reviews for the movie ${movieID}:`, err));
    }

  // TODO: Implement add review functionality for watched movies
  const handleToggleAddReview = (movieId) => {
    setAddingReviewFor(prev => ({ ...prev, [movieId]: !prev[movieId] }));
    setNewReviewText(prev => ({ ...prev, [movieId]: '' }));
  };

  const handleSubmitReview = (movieId) => {
    const text = newReviewText[movieId]?.trim();
    if (!text) return;

    fetch(`http://localhost:3001/movies/${movieId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then(res => res.json())
      .then(newReview => {
        setReviewsMap(prev => ({
          ...prev,
          [movieId]: [...(prev[movieId] || []), newReview],
        }));
        setAddingReviewFor(prev => ({ ...prev, [movieId]: false }));
        setNewReviewText(prev => ({ ...prev, [movieId]: '' }));
      })
      .catch(err => console.error(`Failed to add review for movie ${movieId}:`, err));
  };
  
  // TODO: Implement edit/delete review functionality
  const handleDeleteReview = (movieId, reviewId) => {
    fetch(`http://localhost:3001/movies/${movieId}/reviews/${reviewId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setReviewsMap(prev => ({
          ...prev,
          [movieId]: prev[movieId].filter(r => r.id !== reviewId),
        }));
      })
      .catch(err => console.error(`Failed to delete review ${reviewId}:`, err));
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
              {(reviewsMap[movie.id] || []).length > 0 && (
                <Box sx={{ width: '100%', mt: 1, mb: 1 }}>
                  {(reviewsMap[movie.id] || []).map(review => (
                <Box key={review.id} sx={{ mb: 1 }}>
                  {editingReview[review.id] ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField size="small" fullWidth value={editingReview[review.id].text} onChange={e => setEditingReview(prev => ({...prev, [review.id]: { ...prev[review.id], text: e.target.value },})) }/>
                    <IconButton color="primary" onClick={() => handleSaveEdit(movie.id, review.id)} title="Save">
                      <SaveIcon />
                    </IconButton>
                    <IconButton color="default" onClick={() => handleCancelEdit(review.id)} title="Cancel">
                      <CancelIcon />
                    </IconButton>
                    </Stack>
                  ) : (
                                  // View mode
                                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                      • {review.text}
                                    </Typography>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleStartEdit(movie.id, review)}
                                      title="Edit review"
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteReview(movie.id, review.id)}
                                      title="Delete review"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Stack>
                                )}
                              </Box>
                            ))}
                            <Divider sx={{ mt: 1 }} />
                          </Box>
                        )}
            
                        {/* Add Review form */}
                        {addingReviewFor[movie.id] ? (
                          <Box sx={{ width: '100%', mt: 1 }}>
                            <TextField
                              label="Write your review"
                              variant="outlined"
                              size="small"
                              fullWidth
                              multiline
                              minRows={2}
                              value={newReviewText[movie.id] || ''}
                              onChange={e =>
                                setNewReviewText(prev => ({ ...prev, [movie.id]: e.target.value }))
                              }
                            />
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleSubmitReview(movie.id)}
                              >
                                Submit
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleToggleAddReview(movie.id)}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          </Box>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
                            onClick={() => handleToggleAddReview(movie.id)}
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
