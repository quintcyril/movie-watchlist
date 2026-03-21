import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


function useReviews() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviewInputs, setReviewInputs] = useState({});
  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/movies').then(res => res.json()),
      fetch('http://localhost:3001/reviews').then(res => res.json()),
    ]).then(([movies, reviews]) => {
      const watched = movies
        .filter(movie => movie.watched)
        .map(movie => ({
          ...movie,
          reviews: reviews.filter(r => r.movieId === movie.id),
        }));
      setWatchedMovies(watched);
    });
  }, []);

  const updateMovieReviews = (movieId, updatedReviews) => {
  const movie = watchedMovies.find(m => m.id === movieId); 
  const movieTitle = movie ? movie.title : '';              

  return fetch(`http://localhost:3001/reviews?movieId=${movieId}`)
    .then(res => res.json())
    .then(existing => {
      const deletePromises = existing.map(r =>
        fetch(`http://localhost:3001/reviews/${r.id}`, { method: 'DELETE' })
      );
      return Promise.all(deletePromises);
    })
    .then(() => {
      const addPromises = updatedReviews.map(r =>
        fetch('http://localhost:3001/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...r, movieId: Number(movieId), movieTitle }), 
        })
      );
      return Promise.all(addPromises);
    })
    .then(() => {
      setWatchedMovies(prev =>
        prev.map(m => (m.id === movieId ? { ...m, reviews: updatedReviews } : m))
      );
    });
};


  const handleAddReview = (movieId) => {
    const text = reviewInputs[movieId];
    if (!text) return;

    const movie = watchedMovies.find(m => m.id === movieId);
    const updatedReviews = movie.reviews
      ? [...movie.reviews, { id: Date.now(), text }]
      : [{ id: Date.now(), text }];

    updateMovieReviews(movieId, updatedReviews).then(() => {
      setReviewInputs(prev => ({ ...prev, [movieId]: '' }));
    });
  };

  const handleDeleteReview = (movieId, reviewId) => {
    const movie = watchedMovies.find(m => m.id === movieId);
    const updatedReviews = movie.reviews.filter(r => r.id !== reviewId);
    updateMovieReviews(movieId, updatedReviews);
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
    updateMovieReviews(movieId, updatedReviews).then(() => {
      setEditingReview(null);
      setEditText('');
    });
  };

  return {
    watchedMovies,
    reviewInputs,
    setReviewInputs,
    editingReview,
    editText,
    setEditText,
    handleAddReview,
    handleDeleteReview,
    handleEditReview,
    handleSaveEdit,
  };
}


function ReviewRow({ review, movieId, editingReview, editText, setEditText, onSaveEdit, onEditReview, onDeleteReview }) {
  const isEditing = editingReview === review.id;

  return (
    <Box sx={{ width: '100%', mb: 1 }}>
      {isEditing ? (
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
            onClick={() => onSaveEdit(movieId)}
          >
            Save
          </Button>
        </>
      ) : (
        <>
          <Typography variant="body2">{review.text}</Typography>
          <Button size="small" onClick={() => onEditReview(review)}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={() => onDeleteReview(movieId, review.id)}>
            Delete
          </Button>
        </>
      )}
    </Box>
  );
}


function AddReviewForm({ movieId, value, onChange, onAdd }) {
  return (
    <>
      <TextField
        fullWidth
        size="small"
        placeholder="Write a review..."
        value={value}
        onChange={(e) => onChange(movieId, e.target.value)}
        sx={{ mt: 1 }}
      />
      <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => onAdd(movieId)}>
        Add Review
      </Button>
    </>
  );
}


function MovieCard({ movie, reviewInputs, setReviewInputs, editingReview, editText, setEditText, handleAddReview, handleDeleteReview, handleEditReview, handleSaveEdit }) {
  return (
    <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 3 }}>
      <ListItemText primary={movie.title} secondary={movie.genre} />

      {movie.reviews && movie.reviews.map(review => (
        <ReviewRow
          key={review.id}
          review={review}
          movieId={movie.id}
          editingReview={editingReview}
          editText={editText}
          setEditText={setEditText}
          onSaveEdit={handleSaveEdit}
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
        />
      ))}

      <AddReviewForm
        movieId={movie.id}
        value={reviewInputs[movie.id] || ''}
        onChange={(id, val) => setReviewInputs(prev => ({ ...prev, [id]: val }))}
        onAdd={handleAddReview}
      />
    </ListItem>
  );
}


export default function ReviewScreen() {
  const reviews = useReviews();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>
      <List>
        {reviews.watchedMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} {...reviews} />
        ))}
      </List>
    </Box>
  );
}