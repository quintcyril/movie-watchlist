import React, { useState, useEffect } from 'react';
import MovieCard from '../../Common/moviecard';
import '../../includes/common.css';

import {
    Box,
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

export default function MovieWatchListMain() {
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('Action');
    const [totalCount, setTotalCount] = useState(0);

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    // Update totalCount whenever movies change
    useEffect(() => {
        setTotalCount(movies.length);
    }, [movies]);

    const handleAddMovie = () => {
        if (title.trim()) {
            setMovies([...movies, { id: Date.now(), title, genre }]);
            setTitle('');
        }
    };

    const handleRemoveMovie = (id) => {
        setMovies(movies.filter(movie => movie.id !== id));
    };

    const handleStartEdit = (movie) => {
        setEditingId(movie.id);
        setEditTitle(movie.title);
    };

    const handleUpdateTitle = (id) => {
        if (editTitle.trim() !== "") {
            setMovies(
                movies.map(movie =>
                    movie.id === id ? { ...movie, title: editTitle } : movie
                )
            );
        }
        setEditingId(null);
        setEditTitle('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
    };

    return (
        <div className="watchlist-container">
            <h1>Movie Watchlist</h1>

            <div className="total-count">
                <h2>Total Watched: {totalCount}</h2>
            </div>

            <div className="input-section">
                <input
                    type="text"
                    placeholder="Enter movie title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMovie()}
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

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddMovie}
                    sx={{ minWidth: 160 }}
                >
                    Add to Watchlist
                </Button>
            </div>

            {/* Movie List */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {movies.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} key={movie.id}>

                        {editingId === movie.id ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <TextField
                                    label="Edit Title"
                                    variant="outlined"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />

                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleUpdateTitle(movie.id)}
                                    >
                                        Save
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <MovieCard
                                title={movie.title}
                                genre={movie.genre}
                                onRemove={() => handleRemoveMovie(movie.id)}
                                onUpdate={() => handleStartEdit(movie)}
                            />
                        )}

                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

