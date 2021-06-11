const fs = require('fs');
const {
    filterByQuery,
    findByID,
    createNewAnimal,
    validateAnimal
} = require('../lib/animals');

const { animals } = require('../data/animals');
const { TestWatcher } = require('@jest/core');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const { text } = require('express');

jest.mock('fs'); //this fakes the test so that the data is not updated in data/animals.json file

test('Create New Animal', () => {
    const animal = createNewAnimal( 
        { name: "Val", id: 'afdajsldkfa' },
         animals
    );
    expect(animal.name).toBe('Val');
    expect(animal.id).toBe('afdajsldkfa');
});

test('Filter by Query', () => {
    const startingAnimals = [
        {
            id: "3",
            name: "Erica",
            species: "gorilla",
            diet: "omnivore",
            personalityTraits: ["quirky", "rash"],
          },
          {
            id: "4",
            name: "Noel",
            species: "bear",
            diet: "carnivore",
            personalityTraits: ["impish", "sassy", "brave"],
          },
        ];
    
    const updatedAnimals = filterByQuery( { species: "bear" }, startingAnimals);
    expect(updatedAnimals.length).toEqual(1);
});

test('Find by ID', () => {
    const startingAnimals = [
        {
            id: "3",
            name: "Erica",
            species: "gorilla",
            diet: "omnivore",
            personalityTraits: ["quirky", "rash"],
          },
          {
            id: "4",
            name: "Noel",
            species: "bear",
            diet: "carnivore",
            personalityTraits: ["impish", "sassy", "brave"],
          },
        ];
    const result = findByID("4", startingAnimals);
    expect(result.name).toBe("Noel");
});

test("validates personality traits", () => {
    const animal = {
      id: "3",
      name: "Erica",
      species: "gorilla",
      diet: "omnivore",
      personalityTraits: ["quirky", "rash"],
    };
  
    const invalidAnimal = {
      id: "3",
      name: "Erica",
      species: "gorilla",
      diet: "omnivore",
    };
  
    const result = validateAnimal(animal);
    const result2 = validateAnimal(invalidAnimal);
  
    expect(result).toBe(true);
    expect(result2).toBe(false);
  });
