import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { movieApi } from '../../Common/api';

const emptyForm = { title: '', genre: '', releaseYear: new Date().getFullYear() };

function MvcSample() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [createdMovie, setCreatedMovie] = useState(null);
  const [saving, setSaving] = useState(false);

  // List state
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [busyId, setBusyId] = useState(null); // row being saved/deleted

  // List: GET /api/Movie on page load
  const loadMovies = async () => {
    setLoading(true);
    setListError('');
    try {
      const data = await movieApi.getAll();
      setMovies(data);
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleChange = (field) => (event) =>
    setForm({ ...form, [field]: event.target.value });

  // Create: POST /api/Movie
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setCreatedMovie(null);
    setSaving(true);
    try {
      const created = await movieApi.create({
        title: form.title.trim(),
        genre: form.genre.trim(),
        releaseYear: Number(form.releaseYear),
        watched: false,
      });
      setCreatedMovie(created);
      setMovies((prev) => [...prev, created]); // show new row without a browser refresh
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Edit: enter/leave edit mode
  const startEdit = (movie) => {
    setEditingId(movie.id);
    setEditForm({
      title: movie.title,
      genre: movie.genre ?? '',
      releaseYear: movie.releaseYear,
      watched: movie.watched,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleEditChange = (field) => (event) => {
    const value = field === 'watched' ? event.target.checked : event.target.value;
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Update: PUT /api/Movie/{id} — send the complete body (backend replaces all fields)
  const saveEdit = async (id) => {
    setListError('');
    setBusyId(id);
    try {
      const updated = await movieApi.update(id, {
        title: editForm.title.trim(),
        genre: editForm.genre.trim(),
        releaseYear: Number(editForm.releaseYear),
        watched: Boolean(editForm.watched),
      });
      // Backend returns the saved model; keep the UI in sync with it.
      setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
      cancelEdit();
    } catch (err) {
      setListError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  // Delete: DELETE /api/Movie/{id} — 204 No Content
  const handleDelete = async (id) => {
    setListError('');
    setBusyId(id);
    try {
      await movieApi.remove(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setListError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Box>
      <h2>Create a Movie &mdash; React to ASP.NET Core</h2>
      <p>
        React (View) &rarr; <code>MovieController</code> (Controller) &rarr; <code>MovieService</code> &rarr;{' '}
        <code>MovieRepository</code> &rarr; MySQL <code>Movies</code> table (Model).
      </p>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {createdMovie && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Created #{createdMovie.id}: {createdMovie.title} ({createdMovie.genre}, {createdMovie.releaseYear})
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField label="Title" size="small" required inputProps={{ maxLength: 150 }} value={form.title} onChange={handleChange('title')} />
          <TextField label="Genre" size="small" inputProps={{ maxLength: 50 }} value={form.genre} onChange={handleChange('genre')} />
          <TextField label="Year" size="small" type="number" required inputProps={{ min: 1888, max: 2200 }} value={form.releaseYear} onChange={handleChange('releaseYear')} />
          <Button type="submit" variant="contained" disabled={saving || !form.title.trim()}>
            {saving ? 'Saving...' : 'Add Movie'}
          </Button>
        </Stack>
      </Box>

      {/* List / Update / Delete */}
      <Typography variant="h6" sx={{ mb: 1 }}>Saved Movies</Typography>
      {listError && <Alert severity="error" sx={{ mb: 2 }}>{listError}</Alert>}

      {loading ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={20} />
          <span>Loading movies…</span>
        </Stack>
      ) : movies.length === 0 ? (
        <Alert severity="info">No movies yet. Add one above to get started.</Alert>
      ) : (
        <TableContainer component={Paper}>
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
              {movies.map((movie) => {
                const isEditing = editingId === movie.id;
                const isBusy = busyId === movie.id;
                return (
                  <TableRow key={movie.id}>
                    <TableCell>{movie.id}</TableCell>
                    {isEditing ? (
                      <>
                        <TableCell>
                          <TextField size="small" value={editForm.title} onChange={handleEditChange('title')} inputProps={{ maxLength: 150 }} required />
                        </TableCell>
                        <TableCell>
                          <TextField size="small" value={editForm.genre} onChange={handleEditChange('genre')} inputProps={{ maxLength: 50 }} />
                        </TableCell>
                        <TableCell>
                          <TextField size="small" type="number" value={editForm.releaseYear} onChange={handleEditChange('releaseYear')} inputProps={{ min: 1888, max: 2200 }} sx={{ width: 100 }} />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={Boolean(editForm.watched)} onChange={handleEditChange('watched')} />
                        </TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="contained" onClick={() => saveEdit(movie.id)} disabled={isBusy || !editForm.title.trim()} sx={{ mr: 1 }}>
                            {isBusy ? 'Saving…' : 'Save'}
                          </Button>
                          <Button size="small" onClick={cancelEdit} disabled={isBusy}>Cancel</Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{movie.title}</TableCell>
                        <TableCell>{movie.genre}</TableCell>
                        <TableCell>{movie.releaseYear}</TableCell>
                        <TableCell>{movie.watched ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="right">
                          <Button size="small" onClick={() => startEdit(movie)} disabled={isBusy} sx={{ mr: 1 }}>Edit</Button>
                          <Button size="small" color="error" onClick={() => handleDelete(movie.id)} disabled={isBusy}>
                            {isBusy ? 'Deleting…' : 'Delete'}
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default MvcSample;
