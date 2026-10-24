import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { movieApi } from '../../Common/api';

const emptyForm = { title: '', genre: '', releaseYear: new Date().getFullYear() };

function MvcSample() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [createdMovie, setCreatedMovie] = useState(null);
  const [saving, setSaving] = useState(false);
  // Movies now come from the database (GET /api/Movie), not from hardcoded preview rows.
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [editingMovie, setEditingMovie] = useState(null);
  const [editError, setEditError] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingMovie, setDeletingMovie] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [crudNotice, setCrudNotice] = useState('');

  // Fetches the saved movies and replaces the table contents.
  // The caller turns the spinner on (or `loading` starts as true on first render).
  const loadMovies = useCallback(
    () =>
      movieApi
        .getAll()
        .then((data) => {
          setMovies(data);
          setListError('');
        })
        .catch((err) => setListError(`Could not load movies: ${err.message}`))
        .finally(() => setLoading(false)),
    [],
  );

  // List: load once when the page opens.
  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  // List: the Refresh button re-reads the database.
  const handleLoadMovies = () => {
    setLoading(true);
    setCrudNotice('');
    loadMovies();
  };

  // Update: PUT /api/Movie/{id} replaces all four fields, so send the whole movie.
  const handleUpdateMovie = async (event) => {
    event.preventDefault();
    setEditError('');
    setCrudNotice('');
    setSavingEdit(true);
    try {
      const updated = await movieApi.update(editingMovie.id, {
        title: editingMovie.title.trim(),
        genre: editingMovie.genre.trim(),
        releaseYear: Number(editingMovie.releaseYear),
        watched: editingMovie.watched,
      });
      setCrudNotice(`Saved changes to #${updated.id}: ${updated.title}.`);
      setEditingMovie(null);
      setLoading(true);
      await loadMovies();
    } catch (err) {
      // Dialog stays open so the typed changes are not lost.
      setEditError(`Could not save changes: ${err.message}`);
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete: DELETE /api/Movie/{id} answers 204 No Content, so api.js returns null and parses no JSON.
  const handleDeleteMovie = async () => {
    setDeleteError('');
    setCrudNotice('');
    setDeleting(true);
    try {
      await movieApi.remove(deletingMovie.id);
      setCrudNotice(`Deleted "${deletingMovie.title}" (#${deletingMovie.id}).`);
      setDeletingMovie(null);
      setLoading(true);
      await loadMovies();
    } catch (err) {
      setDeleteError(`Could not delete: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenEdit = (movie) => {
    setEditError('');
    setCrudNotice('');
    // Genre is nullable in MySQL; '' keeps the TextField a controlled input.
    setEditingMovie({ ...movie, genre: movie.genre ?? '' });
  };

  const handleOpenDelete = (movie) => {
    setDeleteError('');
    setCrudNotice('');
    setDeletingMovie(movie);
  };

  const handleEditChange = (field) => (event) =>
    setEditingMovie({ ...editingMovie, [field]: event.target.value });

  const handleChange = (field) => (event) =>
    setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setCreatedMovie(null);
    setCrudNotice('');
    setSaving(true);
    try {
      const created = await movieApi.create({
        title: form.title.trim(),
        genre: form.genre.trim(),
        releaseYear: Number(form.releaseYear),
        watched: false,
      });
      setCreatedMovie(created);
      setForm(emptyForm);
      // Create: show the new row without a browser refresh.
      setLoading(true);
      await loadMovies();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <h2>Movies</h2>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {createdMovie && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Created #{createdMovie.id}: {createdMovie.title} ({createdMovie.genre}, {createdMovie.releaseYear})
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <TextField label="Title" size="small" required sx={{ flex: 2 }} inputProps={{ maxLength: 150 }} value={form.title} onChange={handleChange('title')} />
          <TextField label="Genre" size="small" sx={{ flex: 1 }} inputProps={{ maxLength: 50 }} value={form.genre} onChange={handleChange('genre')} />
          <TextField label="Year" size="small" type="number" required sx={{ flex: 1 }} inputProps={{ min: 1888, max: 2200 }} value={form.releaseYear} onChange={handleChange('releaseYear')} />
          <Button type="submit" variant="contained" disabled={saving || !form.title.trim()}>
            {saving ? 'Saving...' : 'Add Movie'}
          </Button>
        </Stack>
      </Box>

      <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography component="h3" variant="h6" sx={{ flex: 1 }}>Movie List</Typography>
          <Button onClick={handleLoadMovies} disabled={loading}>Refresh</Button>
        </Stack>
        {crudNotice && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setCrudNotice('')}>{crudNotice}</Alert>}
        {listError && <Alert severity="error" sx={{ mb: 2 }}>{listError}</Alert>}
        <TableContainer>
          <Table size="small" aria-label="Movie list" sx={{ minWidth: 620 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><CircularProgress size={24} /></TableCell></TableRow>
              )}
              {!loading && !listError && movies.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>No movies found.</TableCell></TableRow>
              )}
              {!loading && movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>{movie.id}</TableCell>
                  <TableCell component="th" scope="row">{movie.title}</TableCell>
                  <TableCell>{movie.genre || '-'}</TableCell>
                  <TableCell>{movie.releaseYear}</TableCell>
                  <TableCell>{movie.watched ? 'Watched' : 'Not watched'}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Button size="small" aria-label={`Edit ${movie.title}`} onClick={() => handleOpenEdit(movie)}>Edit</Button>
                    <Button size="small" color="error" aria-label={`Delete ${movie.title}`} onClick={() => handleOpenDelete(movie)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={Boolean(editingMovie)} onClose={() => !savingEdit && setEditingMovie(null)} fullWidth maxWidth="sm" aria-labelledby="edit-movie-title">
        <Box component="form" onSubmit={handleUpdateMovie}>
          <DialogTitle id="edit-movie-title">Edit Movie</DialogTitle>
          <DialogContent>
            {editingMovie && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                {editError && <Alert severity="error">{editError}</Alert>}
                <TextField label="Title" required autoFocus inputProps={{ maxLength: 150 }} value={editingMovie.title} onChange={handleEditChange('title')} />
                <TextField label="Genre" inputProps={{ maxLength: 50 }} value={editingMovie.genre} onChange={handleEditChange('genre')} />
                <TextField label="Release year" type="number" required inputProps={{ min: 1888, max: 2200 }} value={editingMovie.releaseYear} onChange={handleEditChange('releaseYear')} />
                <FormControlLabel label="Watched" control={<Checkbox checked={editingMovie.watched} onChange={(event) => setEditingMovie({ ...editingMovie, watched: event.target.checked })} />} />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingMovie(null)} disabled={savingEdit}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={savingEdit || !editingMovie?.title.trim()}>
              {savingEdit ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(deletingMovie)} onClose={() => !deleting && setDeletingMovie(null)} fullWidth maxWidth="xs" aria-labelledby="delete-movie-title">
        <DialogTitle id="delete-movie-title">Delete Movie?</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {deleteError && <Alert severity="error">{deleteError}</Alert>}
            <Typography sx={{ overflowWrap: 'anywhere' }}>Delete "{deletingMovie?.title}"?</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingMovie(null)} disabled={deleting}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteMovie} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MvcSample;
