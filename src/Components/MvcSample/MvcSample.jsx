import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { movieApi } from '../../Common/api';

const emptyForm = { title: '', genre: '', releaseYear: new Date().getFullYear() };

function MvcSample() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [createdMovie, setCreatedMovie] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (event) =>
    setForm({ ...form, [field]: event.target.value });

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
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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
    </Box>
  );
}

export default MvcSample;
