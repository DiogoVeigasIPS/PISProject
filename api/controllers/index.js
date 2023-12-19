/**
 * Filename: index.js
 * Purpose: Aggregates all controllers.
 */
const userController = require('./userController');

const controllers = {
    userController: userController
}

module.exports = controllers;