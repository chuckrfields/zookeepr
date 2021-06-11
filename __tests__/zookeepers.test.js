const fs = require('fs');
const {
    filterByQuery,
    findByID,
    createNewzookeeper,
    validatezookeeper
} = require('../lib/zookeepers');

const { zookeepers } = require('../data/zookeepers');
const { TestWatcher } = require('@jest/core');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const { text } = require('express');

jest.mock('fs'); //this fakes the test so that the data is not updated in data/zookeepers.json file

test('Create New zookeeper', () => {
    const zookeeper = createNewzookeeper( 
        { name: "Sandy", age: '29' },
         zookeepers
    );
    expect(zookeeper.name).toBe('Sandy');
    expect(zookeeper.id).toBe('29');
});

test('Filter by Query', () => {
    const startingzookeepers = [
        {
            id: "3",
            name: "Erica",
            age: 30,
            favoriteAnimal: "Snake"
          },
          {
            id: "4",
            name: "Noel",
            age: 25,
            favoriteAnimal: "Alligator"
          },
        ];
    
    const updatedzookeepers = filterByQuery( { favoriteAnimal: "Alligator" }, startingzookeepers);
    expect(updatedzookeepers.length).toEqual(1);
});

test('Find by ID', () => {
    const startingzookeepers = [
        {
            id: "3",
            name: "Erica",
            age: 30,
            favoriteAnimal: "Snake"
          },
          {
            id: "4",
            name: "Noel",
            age: 25,
            favoriteAnimal: "Alligator"
          },
        ];
    const result = findByID("4", startingzookeepers);
    expect(result.name).toBe("Noel");
});

test("validates age", () => {
    const zookeeper = {
      id: "2",
      name: "Raksha",
      age: 31,
      favoriteAnimal: "penguin",
    };
  
    const invalidZookeeper = {
      id: "3",
      name: "Isabella",
      age: "67",
      favoriteAnimal: "bear",
    };
  
    const result = validateZookeeper(zookeeper);
    const result2 = validateZookeeper(invalidZookeeper);
  
    expect(result).toBe(true);
    expect(result2).toBe(false);
  });