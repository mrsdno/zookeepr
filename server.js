const { query } = require('express');
const express = require('express');
const QueryString = require('qs');
const PORT = process.env.PORT || 3001;
const { animals } = require('./data/animals');
const app = express();

// parse incoming string or array data
// app.use executed by the express.js server that mounts a function to the server that our requests will pass through before getting to the intended website
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        // save personality traits as a dedicated array. If its a string, place in new array.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }

        // Loop through each trait in the personality array 
        personalityTraitsArray.forEach(trait => {
            // Check trait against each animal in the filtered results arra
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet)
    }
        if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species)
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name)
    }
    return filteredResults;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
})

app.listen(PORT, () => {
    console.log(`API server now on port PORT!`);
});

app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be
    console.log(req.body);
    // res.json sends the data back to the client
    // this test is the fastes way to ensure that the data sent from the client gets there correcly
    res.json(req.body);
})
