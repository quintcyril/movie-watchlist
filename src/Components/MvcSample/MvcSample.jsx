import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
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
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deletingMovie, setDeletingMovie] = useState(null);
  const [crudNotice, setCrudNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    handleLoadMovies();
  }, []);


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
      setForm(emptyForm);
      setMovies((currentMovies) => [...currentMovies, created]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadMovies = async () => {
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

  const handleUpdateMovie = async (event) => {
    event.preventDefault();
    setError('');
    setCrudNotice('');
    setUpdating(true);

    try {
      const updatedMovie = await movieApi.update(editingMovie.id, {
        title: editingMovie.title.trim(),
        genre: (editingMovie.genre || '').trim(),
        releaseYear: Number(editingMovie.releaseYear),
        watched: editingMovie.watched,
      });
      setMovies((currentMovies) => currentMovies.map((movie) =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      ));
      setCrudNotice(`Updated ${updatedMovie.title}.`);
      setEditingMovie(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteMovie = async () => {
    const movieToDelete = deletingMovie;
    setError('');
    setCrudNotice('');
    setDeleting(true);

    try {
      await movieApi.remove(movieToDelete.id);
      setMovies((currentMovies) => currentMovies.filter((movie) => movie.id !== movieToDelete.id));
      setCrudNotice(`Deleted ${movieToDelete.title}.`);
      setDeletingMovie(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditChange = (field) => (event) =>
    setEditingMovie({ ...editingMovie, [field]: event.target.value });

  const handleChange = (field) => (event) =>
    setForm({ ...form, [field]: event.target.value });
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
          <Chip label={`${movies.length} saved`} size="small" variant="outlined" />
          <Button onClick={handleLoadMovies}>Refresh</Button>
        </Stack>
        {crudNotice && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setCrudNotice('')}>{crudNotice}</Alert>}
        {loading && <p>Loading movies...</p>}
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
              {!loading && !error && movies.length === 0 && (
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
                    <Button size="small" aria-label={`Edit ${movie.title}`} onClick={() => { setError(''); setEditingMovie({ ...movie }); }}>Edit</Button>
                    <Button size="small" color="error" aria-label={`Delete ${movie.title}`} onClick={() => { setError(''); setDeletingMovie(movie); }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={Boolean(editingMovie)} onClose={() => setEditingMovie(null)} fullWidth maxWidth="sm" aria-labelledby="edit-movie-title">
        <Box component="form" onSubmit={handleUpdateMovie}>
          <DialogTitle id="edit-movie-title">Edit Movie</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {editingMovie && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField label="Title" required autoFocus inputProps={{ maxLength: 150 }} value={editingMovie.title} onChange={handleEditChange('title')} />
                <TextField label="Genre" inputProps={{ maxLength: 50 }} value={editingMovie.genre || ''} onChange={handleEditChange('genre')} />
                <TextField label="Release year" type="number" required inputProps={{ min: 1888, max: 2200 }} value={editingMovie.releaseYear} onChange={handleEditChange('releaseYear')} />
                <FormControlLabel label="Watched" control={<Checkbox checked={editingMovie.watched} onChange={(event) => setEditingMovie({ ...editingMovie, watched: event.target.checked })} />} />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingMovie(null)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={updating || !editingMovie?.title.trim()}>
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(deletingMovie)} onClose={() => setDeletingMovie(null)} fullWidth maxWidth="xs" aria-labelledby="delete-movie-title">
        <DialogTitle id="delete-movie-title">Delete Movie?</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography sx={{ overflowWrap: 'anywhere' }}>Delete "{deletingMovie?.title}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingMovie(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteMovie} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MvcSample;
