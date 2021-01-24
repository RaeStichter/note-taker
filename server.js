const express = require('express');
// Route that the front end can request data from.
const { noteData } = require('./db/db.json');

// tells Heroku where to go
const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express();



// Route
app.get('/api/notes', (req, res) => {
    res.json(noteData);
});

// get server to listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
