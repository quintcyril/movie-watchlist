import React, { useState, useEffect, use } from 'react';
import MovieCard from '../../Common/moviecard';
import '../../includes/common.css';

export default function MovieWatchListMain() {
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('Action');
    const [totalCount, setTotalCount] = useState(0);

    useEffect (() => {
        setTotalCount(movies.length);
    }, [movies]);

    const [editingId, setEditingId] = useState(null);

    const [editTitle, setEditTitle] = useState('');

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
    }

    const handleUpdateTitle = (id) => {
        if (editTitle.trim()){
            setMovies(
                movies.map(movie =>
                    movie.id === id ? {...movie, title :editTitle} : movie )
                );
        }
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
                        {
                             editingId === movie.id ? (
                                <div className = "edit-form">
                                    <input
                                        type="text"
                                        value={editTitle}>
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    </input>
                                    <button onClick={() => handleUpdateTitle(movie.id)}>
                                        Save
                                        </button>
                                    <button onClick={() => setEditingId(null)}>
                                        Cancel
                                        </button>
                                </div>
                             ) : (
                        <MovieCard
                            title={movie.title}
                            genre={movie.genre}
                            onRemove={() => handleRemoveMovie(movie.id)}
                            onUpdate = { () => handleStartEdit(movie)}
                        />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}