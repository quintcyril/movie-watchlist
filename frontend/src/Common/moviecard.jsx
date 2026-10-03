import '../includes/common.css';

const MovieCard = ({ title, genre, onRemove }) => {
    return (
        <div className="movie-card">
            <div className="movie-card-content">
                <h3 className="movie-card-title">{title}</h3>
                <p className="movie-card-year">{genre}</p>
                <div className="movie-card-actions">
                    {onRemove && (
                        <button onClick={onRemove} className="btn-remove">
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;