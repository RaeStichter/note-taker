const express = require('express');
// Route that the front end can request data from.
const { noteData } = require('./db/db.json');

// instantiate the server
const app = express();



// Route
app.get('/api/notes', (req, res) => {
    res.json(noteData);
});

app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
});
