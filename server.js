const { query } = require('express');
const express = require('express');
const QueryString = require('qs');
const PORT = process.env.PORT || 3001;
const { animals } = require('./data/animals');
const app = express();
const fs = require('fs');
const path = require('path');
// require below will read the index.js file in each folder
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes')

// parse incoming string or array data
// app.use executed by the express.js server that mounts a function to the server that our requests will pass through before getting to the intended website
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

// if client navigates to /api , server back api routes
// if client navigates to/, serve back html routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes)

app.use(express.static('public'));

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


