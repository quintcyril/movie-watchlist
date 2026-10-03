import { useEffect, useState } from 'react';
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

const emptyForm = {
  title: '',
  genre: '',
  releaseYear: new Date().getFullYear(),
};

function MvcSample() {
  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState('');
  const [createdMovie, setCreatedMovie] = useState(null);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingMovie, setEditingMovie] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [deletingMovie, setDeletingMovie] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [crudNotice, setCrudNotice] = useState('');

  // Load movies from the ASP.NET Core backend.
  const handleLoadMovies = async () => {
    setLoading(true);
    setError('');
    setCrudNotice('');

    try {
      const data = await movieApi.getAll();

      // Make sure the result is always an array.
      setMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load movies.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Load movies when the page opens.
  useEffect(() => {
    handleLoadMovies();
  }, []);

  const handleChange = (field) => (event) => {
    setForm({
      ...form,
      [field]: event.target.value,
    });
  };

  const handleEditChange = (field) => (event) => {
    setEditingMovie({
      ...editingMovie,
      [field]: event.target.value,
    });
  };

  // Create a movie.
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

      // Refresh the list after creating.
      await handleLoadMovies();
    } catch (err) {
      setError(err.message || 'Failed to create movie.');
    } finally {
      setSaving(false);
    }
  };

  // Update a movie.
  const handleUpdateMovie = async (event) => {
    event.preventDefault();

    if (!editingMovie) {
      return;
    }

    setError('');
    setCrudNotice('');
    setUpdating(true);

    try {
      const updated = {
        id: editingMovie.id,
        title: editingMovie.title.trim(),
        genre: editingMovie.genre?.trim() || '',
        releaseYear: Number(editingMovie.releaseYear),
        watched: Boolean(editingMovie.watched),
      };

      await movieApi.update(editingMovie.id, updated);

      setEditingMovie(null);

      // Refresh the list after updating.
      await handleLoadMovies();
    } catch (err) {
      setError(err.message || 'Failed to update movie.');
    } finally {
      setUpdating(false);
    }
  };

  // Delete a movie.
  const handleDeleteMovie = async () => {
    if (!deletingMovie) {
      return;
    }

    setError('');
    setCrudNotice('');
    setDeleting(true);

    try {
      await movieApi.remove(deletingMovie.id);

      setDeletingMovie(null);

      // Refresh the list after deleting.
      await handleLoadMovies();
    } catch (err) {
      setError(err.message || 'Failed to delete movie.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Movies
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {createdMovie && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Created #{createdMovie.id}: {createdMovie.title} (
          {createdMovie.genre || '-'}, {createdMovie.releaseYear})
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <TextField
            label="Title"
            size="small"
            required
            sx={{ flex: 2 }}
            inputProps={{ maxLength: 150 }}
            value={form.title}
            onChange={handleChange('title')}
          />

          <TextField
            label="Genre"
            size="small"
            sx={{ flex: 1 }}
            inputProps={{ maxLength: 50 }}
            value={form.genre}
            onChange={handleChange('genre')}
          />

          <TextField
            label="Year"
            size="small"
            type="number"
            required
            sx={{ flex: 1 }}
            inputProps={{ min: 1888, max: 2200 }}
            value={form.releaseYear}
            onChange={handleChange('releaseYear')}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={saving || !form.title.trim()}
          >
            {saving ? 'Saving...' : 'Add Movie'}
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          pt: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography
            component="h3"
            variant="h6"
            sx={{ flex: 1 }}
          >
            Movie List
          </Typography>

          <Chip
            label={loading ? 'Loading...' : 'Database'}
            size="small"
            variant="outlined"
          />

          <Button
            onClick={handleLoadMovies}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </Stack>

        {crudNotice && (
          <Alert
            severity="warning"
            sx={{ mb: 2 }}
            onClose={() => setCrudNotice('')}
          >
            {crudNotice}
          </Alert>
        )}

        <TableContainer>
          <Table
            size="small"
            aria-label="Movie list"
            sx={{ minWidth: 620 }}
          >
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
              {!loading && movies.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    No movies found.
                  </TableCell>
                </TableRow>
              )}

              {movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>{movie.id}</TableCell>

                  <TableCell component="th" scope="row">
                    {movie.title}
                  </TableCell>

                  <TableCell>
                    {movie.genre || '-'}
                  </TableCell>

                  <TableCell>
                    {movie.releaseYear}
                  </TableCell>

                  <TableCell>
                    {movie.watched ? 'Watched' : 'Not watched'}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    <Button
                      size="small"
                      aria-label={`Edit ${movie.title}`}
                      onClick={() =>
                        setEditingMovie({
                          ...movie,
                        })
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      aria-label={`Delete ${movie.title}`}
                      onClick={() =>
                        setDeletingMovie(movie)
                      }
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Edit Movie Dialog */}
      <Dialog
        open={Boolean(editingMovie)}
        onClose={() => {
          if (!updating) {
            setEditingMovie(null);
          }
        }}
        fullWidth
        maxWidth="sm"
        aria-labelledby="edit-movie-title"
      >
        <Box
          component="form"
          onSubmit={handleUpdateMovie}
        >
          <DialogTitle id="edit-movie-title">
            Edit Movie
          </DialogTitle>

          <DialogContent>
            {editingMovie && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField
                  label="Title"
                  required
                  autoFocus
                  inputProps={{ maxLength: 150 }}
                  value={editingMovie.title}
                  onChange={handleEditChange('title')}
                />

                <TextField
                  label="Genre"
                  inputProps={{ maxLength: 50 }}
                  value={editingMovie.genre || ''}
                  onChange={handleEditChange('genre')}
                />

                <TextField
                  label="Release year"
                  type="number"
                  required
                  inputProps={{
                    min: 1888,
                    max: 2200,
                  }}
                  value={editingMovie.releaseYear}
                  onChange={handleEditChange('releaseYear')}
                />

                <FormControlLabel
                  label="Watched"
                  control={
                    <Checkbox
                      checked={Boolean(editingMovie.watched)}
                      onChange={(event) =>
                        setEditingMovie({
                          ...editingMovie,
                          watched: event.target.checked,
                        })
                      }
                    />
                  }
                />
              </Stack>
            )}
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setEditingMovie(null)}
              disabled={updating}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={
                updating ||
                !editingMovie?.title?.trim()
              }
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Movie Dialog */}
      <Dialog
        open={Boolean(deletingMovie)}
        onClose={() => {
          if (!deleting) {
            setDeletingMovie(null);
          }
        }}
        fullWidth
        maxWidth="xs"
        aria-labelledby="delete-movie-title"
      >
        <DialogTitle id="delete-movie-title">
          Delete Movie?
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ overflowWrap: 'anywhere' }}>
            Delete "{deletingMovie?.title}"?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setDeletingMovie(null)}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteMovie}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MvcSample;
