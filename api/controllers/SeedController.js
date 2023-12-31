/**
 * Filename: SeedController.js
 * Purpose: Contains all controllers responsible for 
 * seeding the data base with the following API:
 * https://www.themealdb.com/api.php.
 */
const { seedActions } = require('../actions');
const { handlePromise } = require('../utils');

const seedCategories = (req, res) => {
    const force = req.query.force === 'true';
    handlePromise(seedActions.seedCategories(force), res);
};

const seedAreas = (req, res) => {
    const force = req.query.force === 'true';
    handlePromise(seedActions.seedAreas(force), res);
};

const seedIngredients = (req, res) => {
    const force = req.query.force === 'true';
    handlePromise(seedActions.seedIngredients(force), res);
};

module.exports.seedCategories = seedCategories;
module.exports.seedAreas = seedAreas;
module.exports.seedIngredients = seedIngredients;
