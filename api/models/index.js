/**
 * Filename: index.js
 * Purpose: Aggregates all models.
 */
const Recipe = require('./recipe');
const Ingredient = require('./ingredient');
const User = require('./user');


const models = {
    Recipe: Recipe,
    Ingredient: Ingredient,
    User: User
}

module.exports = models;