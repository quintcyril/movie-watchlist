import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function ReviewScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviewText, setReviewText] = useState({});
  const [activeReview,setActiveReview] = useState(null);

  useEffect(() => {
    // Retrieve watched movies from backend
    fetch('http://localhost:3001/movies')
      .then(res => res.json())
      .then(data => setWatchedMovies(data.filter(movie => movie.watched)));
  }, []);

  const addReview =async(movieId)=>{
       const text = reviewText[movieId];
        if (!text) return;

       const movie =watchedMovies.find(m=> m.id === movieId);
       if(!movie) return; 

    const updatedMovie = {
      ...movie, review:text
    }

     await fetch(`http://localhost:3001/movies/${movieId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedMovie)
  });

    setWatchedMovies(prev =>
    prev.map(m =>
      m.id === movieId ? updatedMovie : m
    ));
    setActiveReview(null);
  }

  const editReview =(movieId)=>{
       const movie =watchedMovies.find(m=> m.id === movieId);
       if(!movie.review) return;

       setReviewText(prev =>({...prev,[movieId]:movie.review}));
       setActiveReview(movieId);
  }

    const deleteReview =async(movieId)=>{
      const movie =watchedMovies.find(m=> m.id === movieId);
   if(!movie) return;
         const updatedMovie = {
      ...movie, review:null
    }
     await fetch(`http://localhost:3001/movies/${movieId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedMovie)
  });
      setWatchedMovies(prev =>(prev.map(m=>m.id === movieId ? updatedMovie:m)))
  }

  // TODO: Implement add review functionality for watched movies
  // TODO: Implement edit/delete review functionality

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Reviews for Watched Movies
      </Typography>
      <List>
        {watchedMovies.map(movie => (
          <ListItem key={movie.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <ListItemText primary={movie.title} secondary={movie.genre} />

                          {movie.review && (
             <Typography sx={{ mt: 1 }}>
            Review: {movie.review}
             </Typography>
)}

            {/* TODO: Add review form and display reviews for this movie */}

                     
            <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={()=> {
                if (movie.review) {
                  editReview(movie.id);
                } else {
                  setActiveReview(movie.id);
                }
              }}>
              {movie.review ? "Edit review" : "Add review"}
             {/* TODO: Implement add review for this movie */             
              }
            </Button>


 {activeReview === movie.id && (
              <>
               <TextField
  fullWidth
  multiline
  minRows={3}
  label="Write your review"
  variant="outlined"
  sx={{ mt: 2 }}
  value={reviewText[movie.id] || ''}
  onChange={(e) =>
    setReviewText({
      ...reviewText,
      [movie.id]: e.target.value
    })
  }
/>

                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => addReview(movie.id)}
                >
                  Save
                </Button>
              </>
            )}
           
{movie.review && (
     <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={()=> deleteReview(movie.id)}>
              
              Delete
            </Button>  
)}
           

          </ListItem>
        ))}
      </List>
    </Box>
  );
}
