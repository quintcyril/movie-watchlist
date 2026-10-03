import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { movieApi } from '../../Common/api';

const emptyForm = {
  title: '',
  genre: '',
  releaseYear: new Date().getFullYear(),
  watched: false,
};

function MvcSample() {
  const [form, setForm] = useState(emptyForm);
  const [movies, setMovies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadMovies = async () => {
    setLoading(true);
    setError('');

    try {
      const savedMovies = await movieApi.getAll();
      setMovies(savedMovies);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleChange = (field) => (event) => {
    const value = field === 'watched' ? event.target.checked : event.target.value;
    setForm({ ...form, [field]: value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    const movie = {
      title: form.title.trim(),
      genre: form.genre.trim(),
      releaseYear: Number(form.releaseYear),
      watched: form.watched,
    };

    try {
      if (editingId !== null) {
        const updatedMovie = await movieApi.update(editingId, movie);
        setMovies(movies.map((item) => item.id === editingId ? updatedMovie : item));
        setMessage(`Updated #${updatedMovie.id}: ${updatedMovie.title}`);
      } else {
        const createdMovie = await movieApi.create(movie);
        setMovies([...movies, createdMovie]);
        setMessage(`Created #${createdMovie.id}: ${createdMovie.title}`);
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (movie) => {
    setEditingId(movie.id);
    setForm({
      title: movie.title,
      genre: movie.genre || '',
      releaseYear: movie.releaseYear,
      watched: movie.watched,
    });
    setMessage('');
    setError('');
  };

  const deleteMovie = async (movie) => {
    const shouldDelete = window.confirm(`Delete ${movie.title}?`);
    if (!shouldDelete) return;

    setError('');
    setMessage('');

    try {
      await movieApi.remove(movie.id);
      setMovies(movies.filter((item) => item.id !== movie.id));
      setMessage(`Deleted ${movie.title}`);

      if (editingId === movie.id) resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: 'auto',
        p: { xs: 2, md: 4 },
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: '0 8px 24px rgba(23, 32, 51, 0.08)',
      }}>
      <h2>Movie List &mdash; React to ASP.NET Core</h2>
      <p>Add, view, update, and delete movies saved in MySQL.</p>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField label="Title" size="small" required inputProps={{ maxLength: 150 }} value={form.title} onChange={handleChange('title')} />
          <TextField label="Genre" size="small" inputProps={{ maxLength: 50 }} value={form.genre} onChange={handleChange('genre')} />
          <TextField label="Year" size="small" type="number" required inputProps={{ min: 1888, max: 2200 }} value={form.releaseYear} onChange={handleChange('releaseYear')} />
          <FormControlLabel control={<Checkbox checked={form.watched} onChange={handleChange('watched')} />} label="Watched" />
          <Button type="submit" variant="contained" disabled={saving || !form.title.trim()}>
            {saving ? 'Saving...' : editingId !== null ? 'Save Changes' : 'Add Movie'}
          </Button>
          {editingId !== null && (
            <Button type="button" variant="outlined" onClick={resetForm}>Cancel</Button>
          )}
        </Stack>
      </Box>

      <h3>Saved Movies</h3>
      {loading && <p>Loading movies...</p>}
      {!loading && movies.length === 0 && <p>No movies found.</p>}

      {!loading && movies.map((movie) => (
        <Box
          key={movie.id}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            py: 2,
            borderBottom: '1px solid #dddddd',
          }}
        >
          <div>
            <strong>#{movie.id} {movie.title}</strong>
            <div>{movie.genre || 'No genre'} | {movie.releaseYear} | {movie.watched ? 'Watched' : 'Not watched'}</div>
          </div>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" onClick={() => startEditing(movie)}>Edit</Button>
            <Button variant="outlined" color="error" size="small" onClick={() => deleteMovie(movie)}>Delete</Button>
          </Stack>
        </Box>
      ))}
    </Box>
  );
}

export default MvcSample;
