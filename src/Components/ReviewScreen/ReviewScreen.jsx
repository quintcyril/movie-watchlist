import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [isReviewed, setIsReviewed] = useState(false);
  const [toBeReviewed, setToBeReviewed] = useState(null)
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('')
  const [editingReview, setEditingReview] = useState(null)

  useEffect(() => {
    // Retrieve watched movies from backend
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  useEffect(() => {
    // Retrieve watched movies from backend
    fetch('http://localhost:3001/reviews')
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  // TODO: Implement add review functionality for watched movies
    const StartAddReview = id => {
    setToBeReviewed(id);
  }

  const AddReview = async (id) => {
    try {
      const res = await fetch('http://localhost:3001/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: id,
          review: newReview
        })
      });

      const data = await res.json();
      console.log(data);
      setReviews(prev => [...prev, data]);

      setNewReview('');
      setToBeReviewed(null);

    } catch (error) {
      console.log('not successful send \nError: ', error);
    }
  };

  // TODO: Implement edit/delete review functionality
  const StartEditReview = (id) => {
    setEditingReview(id);
  }

  const EditReview = (id) => {

  }

  const DeleteReview = async (id) => {
    console.log(id);
    try {
      const res = fetch(`http://localhost:3001/reviews/${id}`, {
        method: 'DELETE'
      });

      const updatedReviews = reviews.filter(r => r.id != id);
      setReviews(updatedReviews);
    } catch (error) {
      console.log('Not successful Deletion \n Error: ', error)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
      <Typography color="primary" variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>
      <List>
        {watchedMovies.map(movie => {
          const review = reviews.find(r => r.movieId === movie.id);

          return (
            <ListItem
              key={movie.id}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <ListItemText
                primary={movie.title}
                secondary={movie.genre}
                primaryTypographyProps={{ color: 'primary' }}
                secondaryTypographyProps={{ color: 'secondary' }}
              />

              {review ? (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <span style={{ fontWeight: 500, color: 'black' }}>Review: </span>
                    {review.review}
                  </Typography>
                  
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button variant="contained" color='warning'>
                        Edit
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        sx={{
                          '&:hover': {
                            backgroundColor: '#ffebee',
                            borderColor: 'red'
                          }
                        }}
                        onClick={ () => DeleteReview(review.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  
                </>
              ) : toBeReviewed === movie.id ? (
                <>
                  <TextField
                    multiline
                    rows={3}
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={() => AddReview(movie.id)}
                  >
                    Submit
                  </Button>
                </>
              ) : editingReview === movie.id ?(
                  <>
                    <TextField
                    multiline
                    rows={3}
                    value={newReview}
                    // onChange={(e) => setNewReview(e.target.value)}
                  />
                    <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2 }}
                    // onClick={() => AddReview(movie.id)}
                  >
                    Submit
                  </Button>
                  </>
              ): (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1 }}
                    onClick={() => StartAddReview(movie.id)}
                  >
                    Add Review
                  </Button>
                </>
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
