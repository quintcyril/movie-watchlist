import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

const MovieCard = ({ title, genre, watched, onToggleWatched, onRemove, onUpdate }) => {
    return (
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
    );
};

export default MovieCard;