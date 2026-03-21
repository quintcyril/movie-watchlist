import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Collapse from '@mui/material/Collapse';
import Chip from '@mui/material/Chip';
import './ReviewScreen.css';

const API = 'http://localhost:3001';

// ── ReviewForm ──────────────────────────────────────────────────────────────
// Reused for both adding and editing a review.
function ReviewForm({ movieId, existing, onSave, onCancel }) {
  const [author, setAuthor] = useState(existing?.author || '');
  const [rating, setRating] = useState(existing?.rating || 0);
  const [text, setText] = useState(existing?.text || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

async function handleSubmit() {
  console.log('Submitting:', { movieId, author, rating, text });
  if (!text.trim()) {
    setError('Review text is required.');
    return;
  }
  setSaving(true);
  setError('');
  try {
    const url = existing
      ? `${API}/reviews/${existing.id}`
      : `${API}/reviews`;
    const method = existing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, author, rating, text }),
    });
    if (!res.ok) throw new Error('Failed to save review.');
    const saved = await res.json();
    onSave(saved);
  } catch (e) {
    setError(e.message);
  } finally {
    setSaving(false);
  }
}

  return (
    <Box className="review-form">
      <Typography variant="subtitle2" className="review-form__title">
        {existing ? 'Edit Review' : 'Write a Review'}
      </Typography>

      <TextField
        label="Your name (optional)"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        size="small"
        fullWidth
        className="review-form__name-field"
      />

      <div className="review-form__rating-wrapper">
        <Typography variant="body2" className="review-form__rating-label">
          Rating
        </Typography>
        <Rating
          value={rating}
          onChange={(_, val) => setRating(val)}
          size="medium"
        />
      </div>

      <TextField
        label="Review"
        value={text}
        onChange={e => setText(e.target.value)}
        multiline
        minRows={3}
        fullWidth
        required
        error={!!error}
        helperText={error}
        className="review-form__text-field"
      />

      <div className="review-form__actions">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={saving}
          size="small"
        >
          {saving ? 'Saving…' : existing ? 'Save Changes' : 'Submit Review'}
        </Button>
        <Button variant="outlined" size="small" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Box>
  );
}

// ── ReviewList ───────────────────────────────────────────────────────────────
// Displays all reviews for one movie, with edit/delete controls.
function ReviewList({ reviews, onEdit, onDelete }) {
  if (reviews.length === 0) {
    return (
      <Typography variant="body2" className="review-list__empty">
        No reviews yet.
      </Typography>
    );
  }

  return (
    <div className="review-list">
      {reviews.map(review => (
        <div key={review.id} className="review-card">
          <div className="review-card__content">
            <div className="review-card__info">
              <Typography variant="body2" className="review-card__author">
                {review.author || 'Anonymous'}
              </Typography>
              {review.rating > 0 && (
                <Rating value={review.rating} size="small" readOnly />
              )}
              <Typography variant="body2" className="review-card__text">
                {review.text}
              </Typography>
              <Typography variant="caption" className="review-card__date">
                {review.updatedAt
                  ? `Edited ${new Date(review.updatedAt).toLocaleDateString()}`
                  : new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </div>
            <div className="review-card__actions">
              <IconButton size="small" onClick={() => onEdit(review)} aria-label="Edit review">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => onDelete(review.id)} aria-label="Delete review">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MovieReviewItem ──────────────────────────────────────────────────────────
// One movie entry: shows its reviews and handles add/edit/delete interactions.
function MovieReviewItem({ movie }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetch(`${API}/reviews/${movie.id}`)
      .then(res => res.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [movie.id]);

  function handleSave(saved) {
    if (editingReview) {
      setReviews(prev => prev.map(r => (r.id === saved.id ? saved : r)));
      setEditingReview(null);
    } else {
      setReviews(prev => [...prev, saved]);
      setShowForm(false);
    }
  }

  async function handleDelete(reviewId) {
    if (!window.confirm('Delete this review?')) return;
    const res = await fetch(`${API}/reviews/${reviewId}`, { method: 'DELETE' });
    if (res.ok) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    }
  }

  function handleEditClick(review) {
    setShowForm(false);
    setEditingReview(review);
  }

  function handleAddClick() {
    setEditingReview(null);
    setShowForm(true);
  }

  return (
    <ListItem className="movie-review-item">
      {/* Movie title + genre */}
      <div className="movie-review-item__header">
        <ListItemText
          primary={
            <Typography className="movie-review-item__title">
              {movie.title}
            </Typography>
          }
          secondary={movie.genre}
          sx={{ m: 0 }}
        />
        <Chip
          label={`${reviews.length} review${reviews.length !== 1 ? 's' : ''}`}
          size="small"
        />
      </div>

      {/* Existing reviews */}
      <ReviewList
        reviews={reviews}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      {/* Edit form (inline, per review) */}
      {editingReview && (
        <ReviewForm
          movieId={movie.id}
          existing={editingReview}
          onSave={handleSave}
          onCancel={() => setEditingReview(null)}
        />
      )}

      {/* Add review button / form */}
      {!editingReview && (
        <>
          <Collapse in={showForm} className="review-form__collapse">
            <ReviewForm
              movieId={movie.id}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </Collapse>
          {!showForm && (
            <Button
              variant="contained"
              color="primary"
              className="movie-review-item__add-btn"
              onClick={handleAddClick}
              size="small"
            >
              Add Review
            </Button>
          )}
        </>
      )}
    </ListItem>
  );
}

// ── ReviewScreen ─────────────────────────────────────────────────────────────
export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);

  useEffect(() => {
    fetch(`${API}/movies`)
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  return (
    <Box className="review-screen">
      <Typography variant="h4" className="review-screen__title">
        Reviews for Watched Movies
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {watchedMovies.length === 0 ? (
        <Typography className="review-screen__empty">
          No watched movies found.
        </Typography>
      ) : (
        <List disablePadding>
          {watchedMovies.map(movie => (
            <MovieReviewItem key={movie.id} movie={movie} />
          ))}
        </List>
      )}
    </Box>
  );
}