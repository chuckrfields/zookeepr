const path = require('path');
const router = require('express').Router(); // Router allows you to declare routes in any file as long as you use the proper middleware

// add route
// The get() method requires two arguments. 
// The first is a string that describes the route the client will have to fetch from. 
// The second is a callback function that will execute every time that route is accessed with a GET request.

// serve index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// redirect if route doesn't exist (this should always come last!)
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;