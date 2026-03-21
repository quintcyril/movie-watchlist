const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Import route modules
const moviesRouter = require('./movies');
const usersRouter = require('./users');
const reviewsRouter = require('./reviews');

app.use('/movies', moviesRouter);
app.use('/users', usersRouter);
app.use('/reviews', reviewsRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));