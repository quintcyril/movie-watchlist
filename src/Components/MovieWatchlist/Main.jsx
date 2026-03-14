import React, { useState, useEffect } from 'react';
import MovieCard from '../../Common/moviecard';
import '../../includes/common.css';

export default function MovieWatchListMain() {
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('Action');
    const [totalCount, setTotalCount] = useState(0);

    // TODO: Add a useEffect that recalculates totalCount whenever the movies array changes
    useEffect(() => {
        setTotalCount(movies.length);
    }, [movies]);

    // TODO: Add two new state variables for editing:
    //   - editingId: tracks which movie is currently being edited (null by default)
    //   - editTitle: holds the current value of the title input while editing
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState(null);

    const handleAddMovie = () => {
        if (title.trim()) {
            setMovies([...movies, { id: Date.now(), title, genre }]);
            setTitle('');
        }
    };

    const handleRemoveMovie = (id) => {
        setMovies(movies.filter(movie => movie.id !== id));
    };

    // TODO: Add a handleStartEdit(movie) function that:
    //   - Sets editingId to the movie's id
    //   - Sets editTitle to the movie's current title

    const handleStartMovie = (id) => {
        setEditingId(movie.id);
        setEditingTitle(movie.title);
    }

    // TODO: Add a handleUpdateTitle(id) function that:
    //   - If editTitle is not empty, updates the matching movie's title in the movies array
    //   - Resets editingId to null and clears editTitle
    const handleUpdateTitle = (id) => {
        if (editingTitle && editingTitle.trim()) {
            setMovies(movies.map(m =>
                m.id === id ? { ...m, title: editingTitle.trim() } : m
            ));
        }
        setEditingId(null);
        setEditingTitle('');
    }

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
                <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                    <option>Action</option>
                    <option>Comedy</option>
                    <option>Drama</option>
                    <option>Horror</option>
                    <option>Sci-Fi</option>
                </select>
                <button onClick={handleAddMovie}>Add to Watchlist</button>
            </div>

            <div className="movies-list">
                {movies.map(movie => (
                    <div key={movie.id}>
                        {editingId === movie.id ? (
                            <div className="edit-section">
                                <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    />
                                <button onClick={() => handleUpdateTitle(movie.id)}>Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </div>

                        ) : (
                            
                        <MovieCard
                            title={movie.title}
                            genre={movie.genre}
                            onRemove={() => handleRemoveMovie(movie.id)}
                        />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}