/**
 * Filename: index.js
 * Purpose: Aggregates all models.
 */
const Recipe = require('./recipe');
const Ingredient = require('./ingredient');
const User = require('./user');
const Difficulty = require('./difficulty');
const IngredientInRecipe = require('./ingredientInRecipe');
const Category = require('./category');
const Area = require('./area');
const Author = require('./author');


const models = {
    Recipe: Recipe,
    Ingredient: Ingredient,
    User: User,
    Difficulty: Difficulty,
    IngredientInRecipe: IngredientInRecipe,
    Category: Category,
    Area: Area,
    Author: Author
}

module.exports = models;