const { filterByQuery, findByID, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
const router = require('express').Router(); // Router allows you to declare routes in any file as long as you use the proper middleware

// add route
// The get() method requires two arguments. 
// The first is a string that describes the route the client will have to fetch from. 
// The second is a callback function that will execute every time that route is accessed with a GET request.

router.get('/animals', (req, res) => {
    // send json as response
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // console.log(req.query);
    res.json(results);
});

router.get('/animals/:id', (req, res) => {
    const result = findByID(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// POST requests differ from GET requests in that they represent the action of a client requesting the server to accept data rather than vice versa.
router.post('/animals', (req, res) => {
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

module.exports = router;