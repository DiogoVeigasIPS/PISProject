/**
 * Filename: index.js
 * Purpose: Aggregates all models.
 */
const Recipe = require('./recipe');
const Ingredient = require('./ingredient');


const models = {
    Recipe: Recipe,
    Ingredient: Ingredient
}

modules.exports = models;