/**
 * Filename: index.js
 * Purpose: Aggregates all controllers.
 */
const userController = require('./userController');
const areaController = require('./areaController');
const categoryController = require('./categoryController');
const difficultyController = require('./difficultyController');
const ingredientController = require('./ingredientController');
const recipeController = require('./recipeController');

const controllers = {
    userController: userController,
    areaController: areaController,
    categoryController: categoryController,
    difficultyController: difficultyController,
    ingredientController: ingredientController,
    recipeController: recipeController
}

module.exports = controllers;