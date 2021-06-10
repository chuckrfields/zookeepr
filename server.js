const fs = require('fs');
const path = require('path'); // provides utilities for working with file and directory paths
const { animals } = require('./data/animals');  // { animails } is destructuring
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// MIDDLEWARE
// app.use() is a method executed by our Express.js server that mounts a function to the server that our requests will pass through before getting to the intended endpoint

// parse incoming string or array data
app.use(express.urlencoded({ extended: true })); // takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object

// parse incoming JSON data
app.use(express.json()); // takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object

/*
  Middleware functions can serve many different purposes. Ultimately they allow us to keep our route endpoint callback functions more readable 
  while letting us reuse functionality across routes to keep our code DRY.
*/

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
        path.join(__dirname, './data/animals.json'), // represents the directory of the file we execute the code in, with the path to the animals.json file
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

// POST requests differ from GET requests in that they represent the action of a client requesting the server to accept data rather than vice versa.
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be
    // console.log(req.body);

    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted');  // 400 indicates to the user that our server doesn't have any problems and we can understand their request, but they incorrectly made the request and we can't allow it to work
        // Anything in the 400 range means that it's a user error and not a server error, and the message can help the user understand what went wrong on their end.
    } else {
        // Add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
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
