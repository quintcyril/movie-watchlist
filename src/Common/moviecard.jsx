import '../includes/common.css';

const MovieCard = ({ title, genre, onRemove, onUpdate }) => {
    return (
        <div className="movie-card">
            <div className="movie-card-content">
                <h3 className="movie-card-title">{title}</h3>
                <p className="movie-card-year">{genre}</p>
                <div className="movie-card-actions">
                    {/* TODO: Add an Edit button that calls onUpdate when clicked.
                         Only render it if the onUpdate prop is provided (similar to the Remove button below) */
                         onUpdate && {
                            <button onClick={onUpdate}>Edit</button>
                         }} 
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