const { query } = require('express');
const express = require('express');
const QueryString = require('qs');
const PORT = process.env.PORT || 3001;
const { animals } = require('./data/animals');
const app = express();
const fs = require('fs');
const path = require('path');

// parse incoming string or array data
// app.use executed by the express.js server that mounts a function to the server that our requests will pass through before getting to the intended website
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

app.use(express.static('public'));

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

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // using synchronus version of write file b/c using small dataset
    fs.writeFileSync(
        // use path.join to specify directory to write file to (__dirname represents the directory you excute code in)
        path.join(__dirname, './data/animals.json'),
        // convert to json, use null + 2 for formatting
        JSON.stringify({animals: animalsArray}, null, 2)
            );

    // return finshed code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'))
});

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'))
});

// the * route should always come last
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals)
    res.json(animal);
    }

    // res.json sends the data back to the client
    res.json(animals)
})


