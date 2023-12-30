/**
 * Filename: index.js
 * Purpose: Aggregates all actions.
 */
const userActions = require('./userActions');
const areaActions = require('./areaActions');
const categoryActions = require('./categoryActions');
const difficultyActions = require('./difficultyActions');
const ingredientActions = require('./ingredientActions');

const actions = {
    userActions: userActions,
    areaActions: areaActions,
    categoryActions: categoryActions,
    difficultyActions: difficultyActions,
    ingredientActions: ingredientActions
}

module.exports = actions;