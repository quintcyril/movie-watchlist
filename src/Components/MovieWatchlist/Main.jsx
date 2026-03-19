import React, { useState, useEffect } from 'react';
// Import MovieCard component to display each movie
import MovieCard from '../../Common/moviecard';
import '../../includes/common.css';
import { Box, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

export default function MovieWatchListMain() {
    // State to store the list of movies
    const [movies, setMovies] = useState([]);
    // State for the new movie title input
    const [title, setTitle] = useState('');
    // State for the selected genre
    const [genre, setGenre] = useState('Action');
    // State for the total count of movies
    const [totalCount, setTotalCount] = useState(0);
    // State for editing movie (id)
    const [editingId, setEditingId] = useState(null);
    // State for editing movie title
    const [editTitle, setEditTitle] = useState('');

    // Fetch movies from backend API when component mounts
    useEffect(() => {
        fetch('http://localhost:3001/movies')
            .then(res => res.json())
            .then(data => setMovies(data));
    }, []);

    // Update totalCount whenever movies change
    useEffect(() => {
        setTotalCount(movies.length);
    }, [movies]);

    // Add a new movie to the watchlist
    const handleAddMovie = async () => {
        if (title.trim()) {
            const newMovie = { id: Date.now(), title, genre, watched: false };
            const res = await fetch('http://localhost:3001/movies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMovie)
            });
            const added = await res.json();
            setMovies([...movies, added]);
            setTitle('');
        }
    };

    // INSERTED LOGIC START 
    const handleToggleWatched = async (id, watched) => {
        const res = await fetch(`http://localhost:3001/movies/${id}`, {
            method: 'PUT', // Changed PATCH to PUT to match backend
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ watched: !watched })
        });
        const updated = await res.json();
        setMovies(movies.map(movie => movie.id === id ? updated : movie));
    };
    // INSERTED LOGIC END 

    const handleRemoveMovie = async (id) => {
        await fetch(`http://localhost:3001/movies/${id}`, { method: 'DELETE' });
        setMovies(movies.filter(movie => movie.id !== id));
    };

    // Start editing a movie title
    const handleStartEdit = (movie) => {
        setEditingId(movie.id);
        setEditTitle(movie.title);
    };

    // Update the movie title after editing
    const handleUpdateTitle = async (id) => {
        if (editTitle.trim()) {
            const res = await fetch(`http://localhost:3001/movies/${id}`, {
                method: 'PUT', // Changed PATCH to PUT to match backend
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle })
            });
            const updated = await res.json();
            setMovies(movies.map(movie => movie.id === id ? updated : movie));
            setEditingId(null);
            setEditTitle('');
        }
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
    };

    // Render the UI
    return (
        <Box sx={{ p: 3 }}>
            <h1>Movie Watchlist</h1>
            <Box sx={{ mb: 2 }}>
                <h2>Total Watched: {totalCount}</h2>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <TextField
                    label="Enter movie title"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMovie()}
                    fullWidth
                />
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="genre-label">Genre</InputLabel>
                    <Select
                        labelId="genre-label"
                        value={genre}
                        label="Genre"
                        onChange={(e) => setGenre(e.target.value)}
                    >
                        <MenuItem value="Action">Action</MenuItem>
                        <MenuItem value="Comedy">Comedy</MenuItem>
                        <MenuItem value="Drama">Drama</MenuItem>
                        <MenuItem value="Horror">Horror</MenuItem>
                        <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleAddMovie} sx={{ minWidth: 160 }}>
                    Add to Watchlist
                </Button>
            </Box>

            {/* Display the list of movies */}
            <Grid container spacing={2}>
                {movies.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} key={movie.id}>
                        {/* If editing, show edit form; otherwise show MovieCard */}
                        {editingId === movie.id ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                                <TextField
                                    label="Edit Title"
                                    variant="outlined"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="contained" color="primary" onClick={() => handleUpdateTitle(movie.id)}>
                                        Save
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <MovieCard
                                title={movie.title}
                                genre={movie.genre}
                                watched={movie.watched}
                                onToggleWatched={() => handleToggleWatched(movie.id, movie.watched)}
                                onRemove={() => handleRemoveMovie(movie.id)}
                                onUpdate={() => handleStartEdit(movie)}
                            />
                        )}
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}