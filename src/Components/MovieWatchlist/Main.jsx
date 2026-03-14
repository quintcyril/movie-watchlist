import React, { useState, useEffect } from 'react';
import MovieCard from '../../Common/moviecard';
import '../../includes/common.css';

export default function MovieWatchListMain() {
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('Action');
    const [totalCount, setTotalCount] = useState(0);
    
    useEffect(() => { setTotalCount(movies.length);}, [movies]); /*Add a useEffect that recalculates totalCount whenever the movies array changes*/

    const [editingId, setEditingId] = useState(null); /*add movie currently edited*/
    const [editTitle, setEditTitle] = useState(''); /*title value*/

    const handleAddMovie = () => {
        if (title.trim()) {
            setMovies([...movies, { id: Date.now(), title, genre }]);
            setTitle('');
        }
    };

    const handleRemoveMovie = (id) => {
        setMovies(movies.filter(movie => movie.id !== id));
    };

    const handleStartEdit = (movie) => { /*added editigID and editTitle*/
        setEditingID(movie.id);
        seteditTitle(movie.title);
    }

    const handleUpdateTitle = (id) => { /* if statement sa editTitle*/
        if(editTitle.trim()){
            setMovies(
                movie.map(movie =>
                    movie,id === id? { ...movie, title: editTitle } : movie
                )
            );
        }
    }

    // TODO: Add a handleStartEdit(movie) function that:
    //   - Sets editingId to the movie's id
    //   - Sets editTitle to the movie's current title

    // TODO: Add a handleUpdateTitle(id) function that:
    //   - If editTitle is not empty, updates the matching movie's title in the movies array
    //   - Resets editingId to null and clears editTitle

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
                        {/* TODO: Check if this movie is being edited (editingId === movie.id).
                             If yes, show an edit form with:
                               - A text input bound to editTitle
                               - A Save button that calls handleUpdateTitle(movie.id)
                               - A Cancel button that resets editingId to null
                             If no, render the MovieCard below and pass onUpdate to it */}
                        <MovieCard
                            title={movie.title}
                            genre={movie.genre}
                            onRemove={() => handleRemoveMovie(movie.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}