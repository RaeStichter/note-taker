const express = require('express');
// Route that the front end can request data from.
const { noteData } = require('./db/db.json');
const fs = require('fs');
const path = require('path');

// tells Heroku where to go
const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express();

// --------------------------- MIDDLEWARE ---------------------------
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// --------------------------- FUNCTIONS ---------------------------
function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
      filteredResults = filteredResults.filter(noteData => noteData.title === query.title);
    }
    if (query.text) {
        filteredResults = filteredResults.filter(noteData => noteData.text === query.text);
    }
    return filteredResults;
}

function findById(id, notesArray) {
    const result = notesArray.filter(noteData => noteData.id === id)[0];
    return result;
}

function createNewNote(body, notesArray) {
    const data = body;
    notesArray.push(data);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ data: notesArray }, null, 2)
    );

    // return finished code to post route for response
    return data;
}

function validateNoteData(data) {
    if (!data.title || typeof data.title !== 'string') {
        return false;
    }
    if (!data.text || typeof data.text !== 'string') {
        return false;
    }
    return true;
}

// --------------------------- Routes ---------------------------
app.get('/api/notes', (req, res) => {
    let results = noteData;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, noteData);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
});

// route post
app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = noteData.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateNoteData(req.body)) {
        res.status(400).send('Ths note is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const data = createNewNote(req.body, noteData);
        res.json(data);
    }
});

// get server to listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
