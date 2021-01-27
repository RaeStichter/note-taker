const express = require('express');
// Route that the front end can request data from.
const { noteData } = require('./db/db.json');
const fs = require('fs');
const path = require('path');

// tells Heroku where to go
const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express();

// // --------------------------- MIDDLEWARE ---------------------------
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// make certain files available without server endpoint
app.use(express.static('public'));

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
    const newData = body;
    notesArray.push(newData);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ noteData: notesArray }, null, 2)
    );
    
    // return finished code to post route for response
    return newData;
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

// // --------------------------- Routes ---------------------------
app.get('/api/notes', (req, res) => {
    
    let results = noteData;
    //console.log(req.query);
    //res.json(results);

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
    // req.body is where our incoming content will be
    //console.log(req.body);
    //res.json(req.body);

    // set id based on what the next index of the array will be
    req.body.id = noteData.length.toString();

    // if any data in req.body is incorrect, send a 400 error back
    if (!validateNoteData(req.body)) {
        res.status(400).send('The note is not properly formatted.');
    } else {
        // add note to json file and notes array in this function
        const newData = createNewNote(req.body, noteData);

        res.json(newData);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


// get server to listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// app.listen(3001, () => {
//     console.log(`API server now on port 3001!`);
// });
