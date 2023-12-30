/**
 * Filename: index.js
 * Purpose: Aggregates all controllers.
 */
const userController = require('./userController');
const areaController = require('./areaController');

const controllers = {
    userController: userController,
    areaController: areaController
}

module.exports = controllers;