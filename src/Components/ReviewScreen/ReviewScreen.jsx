import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState("");
  const [activeMovieId, setActiveMovieId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/reviews')
      .then(res => res.json())
      .then(data => {
        console.log("Reviews from server:", data); 
        const grouped = {};

        data.forEach(review => {
          const key = String(review.movieId);

          if (!grouped[key]) {
            grouped[key] = [];
          }

          grouped[key].push({
            ...review,
            id: review.id || Date.now(),
            text: review.text || review.review || review.content || review.body || ""
          });
        });

        setReviews(grouped);
      })
      .catch(err => console.error(err));
  }, []);

  const addReview = async (movieID) => {
    if (!newReview.trim()) return;

    const reviewData = {
      movieId: String(movieID),
      text: newReview
    };

    try {
      const res = await fetch('http://localhost:3001/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      const savedReview = await res.json();
      console.log("Saved review from server:", savedReview); 

      const finalReview = {
        ...savedReview,
        id: savedReview.id || Date.now(),
        text: savedReview.text || savedReview.review || savedReview.content || savedReview.body || newReview
      };

      setReviews(prev => ({
        ...prev,
        [String(movieID)]: [...(prev[String(movieID)] || []), finalReview]
      }));

      setNewReview("");
      setActiveMovieId(null);

    } catch (err) {
      console.error(err);
    }
  };

  const editReview = async (movieID, review) => {
    const updatedText = prompt("Edit your review:", review.text);
    if (!updatedText) return;

    try {
      const res = await fetch(`http://localhost:3001/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review, text: updatedText })
      });

      const updated = await res.json();

      const normalizedUpdate = {
        ...updated,
        text: updated.text || updated.review || updated.content || updated.body || updatedText
      };

      setReviews(prev => ({
        ...prev,
        [String(movieID)]: prev[String(movieID)].map(r =>
          r.id === review.id ? normalizedUpdate : r
        )
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (movieID, review) => {
    try {
      await fetch(`http://localhost:3001/reviews/${review.id}`, {
        method: 'DELETE'
      });

      setReviews(prev => ({
        ...prev,
        [String(movieID)]: prev[String(movieID)].filter(r => r.id !== review.id)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom color="black">
        Reviews for Watched Movies
      </Typography>

      <List>
        {watchedMovies.map(movie => {
          const movieKey = String(movie.id);

          return (
            <ListItem
              key={movieKey}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <ListItemText
                primary={movie.title}
                secondary={movie.genre}
                slotProps={{
                  primary: { sx: { color: 'black' } },
                  secondary: { sx: { color: 'black' } }
                }}
              />

              {reviews[movieKey]?.map((review) => (
                <Box key={review.id} sx={{ width: '100%', mt: 1, bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: 'black' }}>
                    {review.text}
                  </Typography>

                  <Button size="small" onClick={() => editReview(movieKey, review)}>
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => deleteReview(movieKey, review)}
                  >
                    Delete
                  </Button>
                </Box>
              ))}

              {activeMovieId === movieKey ? (
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
                    onClick={() => addReview(movieKey)}
                  >
                    Submit Review
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => setActiveMovieId(movieKey)}
                >
                  Add Review
                </Button>
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}