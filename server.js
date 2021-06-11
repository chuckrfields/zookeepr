// const fs = require('fs');
// const path = require('path'); // provides utilities for working with file and directory paths
const express = require('express');
// const { animals } = require('./data/animals');  // { animails } is destructuring

const PORT = process.env.PORT || 3001;
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const app = express(); // app represents a single instance of the Express.js server.

// MIDDLEWARE
// app.use() is a method executed by our Express.js server that mounts a function to the server that our requests will pass through before getting to the intended endpoint

// parse incoming string or array data
app.use(express.urlencoded({ extended: true })); // takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object

// parse incoming JSON data
app.use(express.json()); // takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object

// serve web page assets
// provide a file path to a location in our application (in this case, the public folder) and instruct the server to make these files static resources
app.use(express.static('public'));

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

/*
  Middleware functions can serve many different purposes. Ultimately they allow us to keep our route endpoint callback functions more readable 
  while letting us reuse functionality across routes to keep our code DRY.
*/

app.listen(PORT, () => {
    console.log(`API server now listening on port ${PORT}!`);
});
