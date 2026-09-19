import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { movieApi } from '../../Common/api';

const emptyForm = { title: '', genre: '', releaseYear: new Date().getFullYear() };

function MvcSample() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMovies = async () => {
    setLoading(true);
    setError('');
    try {
      setMovies(await movieApi.getAll());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleChange = (field) => (event) =>
    setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await movieApi.create({
        title: form.title,
        genre: form.genre,
        releaseYear: Number(form.releaseYear),
        watched: false,
      });
      setForm(emptyForm);
      await loadMovies();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleWatched = async (movie) => {
    setError('');
    try {
      await movieApi.update(movie.id, { ...movie, watched: !movie.watched });
      await loadMovies();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await movieApi.remove(id);
      await loadMovies();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <h2>MVC Sample &mdash; React to ASP.NET Core</h2>
      <p>
        React (View) &rarr; <code>MovieController</code> (Controller) &rarr; <code>MovieService</code> &rarr;{' '}
        <code>MovieRepository</code> &rarr; MySQL <code>Movies</code> table (Model).
      </p>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField label="Title" size="small" required value={form.title} onChange={handleChange('title')} />
          <TextField label="Genre" size="small" value={form.genre} onChange={handleChange('genre')} />
          <TextField label="Year" size="small" type="number" value={form.releaseYear} onChange={handleChange('releaseYear')} />
          <Button type="submit" variant="contained">Add</Button>
          <Button onClick={loadMovies} disabled={loading}>Refresh</Button>
        </Stack>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Genre</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Watched</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell>{movie.title}</TableCell>
              <TableCell>{movie.genre}</TableCell>
              <TableCell>{movie.releaseYear}</TableCell>
              <TableCell>{movie.watched ? 'Yes' : 'No'}</TableCell>
              <TableCell align="right">
                <Button size="small" onClick={() => handleToggleWatched(movie)}>Toggle</Button>
                <Button size="small" color="error" onClick={() => handleDelete(movie.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
          {!movies.length && !loading && (
            <TableRow>
              <TableCell colSpan={5}>No movies yet.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}

export default MvcSample;
