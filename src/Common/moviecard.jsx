import Card from "@mui/material/card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

const MovieCard = ({ title, genre, watched, onToggleWatched, onRemove, onUpdate }) => {
    return (
        <>
            <Card sx={{ minWidth: 250, mb: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>

                    <Typography color="text.secondary" gutterBottom>
                        {genre}
                    </Typography>

                    <Button
                        size="small"
                        variant={watched ? "contained" : "outlined"}
                        color={watched ? "success" : "warning"}
                        onClick={onToggleWatched}
                        sx={{ mt: 1 }}
                    >
                        {watched ? "Watched" : "Mark as Watched"}
                    </Button>
                </CardContent>

                <CardActions>
                    {onUpdate && (
                        <Button size="small" color="primary" onClick={onUpdate}>
                            Edit
                        </Button>
                    )}

                    {onRemove && (
                        <Button size="small" color="error" onClick={onRemove}>
                            Remove
                        </Button>
                    )}
                </CardActions>
            </Card>

            <div className="movie-card">
                <div className="movie-card-content">
                    <h3 className="movie-card-title">{title}</h3>
                    <p className="movie-card-year">{genre}</p>

                    <div className="movie-card-actions">
                        {onUpdate && (
                            <button onClick={onUpdate} className="btn-edit">
                                Edit
                            </button>
                        )}

                        {onRemove && (
                            <button onClick={onRemove} className="btn-remove">
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MovieCard;