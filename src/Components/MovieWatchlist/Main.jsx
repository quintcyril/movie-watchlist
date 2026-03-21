
// Import React and hooks for state and lifecycle management
import React, { useState, useEffect } from 'react';
// Import MovieCard component to display each movie
import MovieCard from '../../Common/moviecard';
// Import Material UI components for layout and styling
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
// MovieWatchListMain is the main component for the movie watchlist page
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
            // Create a new movie object
            const newMovie = { id: Date.now(), title, genre, watched: false, reviews: [] };
            // Send POST request to backend
            const res = await fetch('http://localhost:3001/movies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMovie)
            });
            const added = await res.json();
            // Update movies state
            setMovies([...movies, added]);
            setTitle('');
        }
    };

    /**
     * This function is called when a user clicks to mark a movie as watched or unwatched.
     *
     * @param {number} id - The unique identifier for the movie (each movie has its own id).
     * @param {boolean} watched - The current watched status of the movie (true or false).
     *
     * Here's what happens step by step:
     * 1. We send a request to the backend server to update the movie's watched status.
     *    - The server is running locally at http://localhost:3001.
     *    - We use the fetch API to send a PUT request to /movies/{id}.
     *    - PUT means "update" in HTTP.
     *    - We send the opposite of the current watched value (if watched is true, we send false, and vice versa).
     *    - The body of the request is a JSON object: { watched: !watched }.
     *    - 'Content-Type: application/json' tells the server we're sending JSON data.
     * 2. We wait for the server to respond with the updated movie object.
     *    - await res.json() converts the response to a JavaScript object.
     * 3. We update our movies state in React so the UI shows the new watched status.
     *    - setMovies updates the movies array.
     *    - We use map to go through each movie:
     *      - If the movie's id matches the one we updated, we replace it with the updated movie from the server.
     *      - Otherwise, we keep the movie as it is.
     *
     * This keeps the UI in sync with the backend database.
     */
    const handleToggleWatched = async (id, watched) => {
        // Send a request to update the watched status for this movie
        const res = await fetch(`http://localhost:3001/movies/${id}`, {
            method: 'PUT', // PUT means "update" the resource
            headers: { 'Content-Type': 'application/json' }, // Tell server we're sending JSON
            body: JSON.stringify({ watched: !watched }) // Send the opposite of current watched value
        });
        // Wait for the server to send back the updated movie
        const updated = await res.json();
        // Update the movies array in state so the UI refreshes
        setMovies(
            movies.map(movie =>
                movie.id === id ? updated : movie // Replace the updated movie, keep others the same
            )
        );
    };

    // Remove a movie from the watchlist
    const handleRemoveMovie = async (id) => {
        await fetch(`http://localhost:3001/movies/${id}`, {
            method: 'DELETE'
        });
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
                method: 'PUT',
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
        <Box sx={{ width: '100%', mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
            {/* Title of the page */}
            <Typography variant="h4" align="center" gutterBottom>
                Movie Watchlist
            </Typography>
            {/* Display total count of movies */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6">Total Watched: {totalCount}</Typography>
            </Box>
            {/* Input fields for adding a new movie */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <TextField
                    label="Movie Title"
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
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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