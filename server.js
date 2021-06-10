const { animals } = require('./data/animals');  // { animails } is destructuring
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

function findByID(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id) [0];
    return result;
}

// add route
// The get() method requires two arguments. 
// The first is a string that describes the route the client will have to fetch from. 
// The second is a callback function that will execute every time that route is accessed with a GET request.

app.get('/api/animals', (req, res) => {
    // We are using the send() method from the res parameter (short for response) to send the string Hello! to our client.
    // res.send('Hello!');

    // send json as response
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // console.log(req.query);
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findByID(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

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

app.listen(PORT, () => {
    console.log(`API server now listening on port ${PORT}!`);
});
