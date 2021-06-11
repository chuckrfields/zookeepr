const fs = require('fs');
const path = require('path');

function filterByQuery(query, zookeepersArray) {
    let personalityTraitsArray = [];
    // Note that we save the zookeepersArray as filteredResults
    let filteredResults = zookeepersArray;

    if (query.name) {
        filteredResults = filteredResults.filter(zookeeper => zookeeper.name.toLowerCase() === query.name.toLowerCase());
    }
    if (query.age) {
      // Since our form data will be coming in as strings, and our JSON is storing
      // age as a number, we must convert the query string to a number to
      // perform a comparison:
        filteredResults = filteredResults.filter(zookeeper => zookeeper.age === Number(query.age));
    }
    if (query.favoriteAnimal) {
        filteredResults = filteredResults.filter(zookeeper => zookeeper.favoriteAnimal.toLowerCase() === query.favoriteAnimal.toLowerCase());
    }
    return filteredResults;
}

function findByID(id, zookeepersArray) {
    const result = zookeepersArray.filter(zookeeper => zookeeper.id === id) [0];
    return result;
}

function createNewZooKeeper(body, zookeepersArray) {
    console.log(body);
    // main code
    const zookeeper = body;
    zookeepersArray.push(zookeeper);

    // update json file
    fs.writeFileSync(  // synchronous version of fs.writeFile() and doesn't require a callback function
        path.join(__dirname, '../data/zookeepers.json'), // represents the directory of the file we execute the code in, with the path to the zookeepers.json file
        JSON.stringify( { zookeepers: zookeepersArray }, null, 2)
        /*
            we need to save the JavaScript array data as JSON, so we use JSON.stringify() to convert it. 
            The other two arguments used in the method, null and 2, are means of keeping our data formatted. 
            The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. 
            The 2 indicates we want to create white space between our values to make it more readable. 
        */
    );
    // return finished code to post route for response
    return zookeeper;
}

function validateZooKeeper(zookeeper) {
    if (!zookeeper.name || typeof zookeeper.name !== 'string') {
        return false;
    }
    if (!zookeeper.favoriteAnimal || typeof zookeeper.favoriteAnimal !== 'string') {
        return false;
    }
    if (!zookeeper.age || typeof zookeeper.age !== 'number') {
        return false;
    }
    return true;
}

module.exports = {
    createNewZooKeeper,
    filterByQuery,
    findByID,
    validateZooKeeper
};