import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { movieApi } from '../../Common/api';

const makeEmptyForm = () => ({
  title: '',
  genre: '',
  releaseYear: new Date().getFullYear(),
  watched: false,
});

function MvcSample() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(makeEmptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [savedMovie, setSavedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // READ
  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await movieApi.getAll();
      setMovies(data ?? []);
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
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(makeEmptyForm());
    setEditingId(null);
  };

  // CREATE + UPDATE
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSavedMovie(null);
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      genre: form.genre.trim(),
      releaseYear: Number(form.releaseYear),
      watched: form.watched,
    };

    try {
      if (editingId) {
        await movieApi.update(editingId, { id: editingId, ...payload });
        setSavedMovie({ id: editingId, ...payload, action: 'Updated' });
      } else {
        const created = await movieApi.create(payload);
        setSavedMovie({ ...payload, ...created, action: 'Created' });
      }
      resetForm();
      await loadMovies();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (movie) => {
    setError('');
    setSavedMovie(null);
    setEditingId(movie.id);
    setForm({
      title: movie.title ?? '',
      genre: movie.genre ?? '',
      releaseYear: movie.releaseYear ?? new Date().getFullYear(),
      watched: Boolean(movie.watched),
    });
  };

  // DELETE
  const handleDelete = async (movie) => {
    if (!window.confirm(`Delete "${movie.title}"?`)) return;
    setError('');
    setSavedMovie(null);
    try {
      await movieApi.remove(movie.id);
      if (editingId === movie.id) resetForm();
      await loadMovies();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <h2>{editingId ? `Edit Movie #${editingId}` : 'Create a Movie'} &mdash; React to ASP.NET Core</h2>
      <p>
        React (View) &rarr; <code>MovieController</code> (Controller) &rarr; <code>MovieService</code> &rarr;{' '}
        <code>MovieRepository</code> &rarr; MySQL <code>Movies</code> table (Model).
      </p>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {savedMovie && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSavedMovie(null)}>
          {savedMovie.action} #{savedMovie.id}: {savedMovie.title} ({savedMovie.genre}, {savedMovie.releaseYear})
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField label="Title" size="small" required inputProps={{ maxLength: 150 }} value={form.title} onChange={handleChange('title')} />
          <TextField label="Genre" size="small" inputProps={{ maxLength: 50 }} value={form.genre} onChange={handleChange('genre')} />
          <TextField label="Year" size="small" type="number" required inputProps={{ min: 1888, max: 2200 }} value={form.releaseYear} onChange={handleChange('releaseYear')} />
          <FormControlLabel
            control={<Checkbox checked={form.watched} onChange={handleChange('watched')} />}
            label="Watched"
          />
          <Button type="submit" variant="contained" disabled={saving || !form.title.trim()}>
            {saving ? 'Saving...' : editingId ? 'Update Movie' : 'Add Movie'}
          </Button>
          {editingId && (
            <Button variant="outlined" onClick={resetForm} disabled={saving}>
              Cancel
            </Button>
          )}
        </Stack>
      </Box>

      {loading ? (
        <p>Loading movies...</p>
      ) : movies.length === 0 ? (
        <p>No movies yet.</p>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Watched</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie.id} selected={movie.id === editingId}>
                  <TableCell>{movie.id}</TableCell>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>{movie.genre}</TableCell>
                  <TableCell>{movie.releaseYear}</TableCell>
                  <TableCell>{movie.watched ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => handleEdit(movie)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(movie)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default MvcSample;