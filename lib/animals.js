const fs = require('fs');
const path = require('path');

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }

    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
            animal => animal.personalityTraits.indexOf(trait) !== -1
        );
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findByID(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id) [0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    console.log(body);
    // main code
    const animal = body;
    animalsArray.push(animal);

    // update json file
    fs.writeFileSync(  // synchronous version of fs.writeFile() and doesn't require a callback function
        path.join(__dirname, '../data/animals.json'), // represents the directory of the file we execute the code in, with the path to the animals.json file
        JSON.stringify( { animals: animalsArray }, null, 2)
        /*
            we need to save the JavaScript array data as JSON, so we use JSON.stringify() to convert it. 
            The other two arguments used in the method, null and 2, are means of keeping our data formatted. 
            The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. 
            The 2 indicates we want to create white space between our values to make it more readable. 
        */
    );
    // return finished code to post route for response
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

module.exports = {
    filterByQuery,
    findByID,
    createNewAnimal,
    validateAnimal
};