/**
 * Filename: index.js
 * Purpose: Aggregates all controllers.
 */
const userController = require('./userController');
const areaController = require('./areaController');
const categoryController = require('./categoryController');
const difficultyController = require('./difficultyController');

const controllers = {
    userController: userController,
    areaController: areaController,
    categoryController: categoryController,
    difficultyController: difficultyController
}

module.exports = controllers;