const fs = require("fs");
const path = require("path");

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

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
  }
  

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // using synchronus version of write file b/c using small dataset
    fs.writeFileSync(
        // use path.join to specify directory to write file to (__dirname represents the directory you excute code in)
        path.join(__dirname, '../data/animals.json'),
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

module.exports ={
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
}