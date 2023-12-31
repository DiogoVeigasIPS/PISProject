/**
 * Filename: index.js
 * Purpose: Aggregates all actions.
 */
const userActions = require('./userActions');
const areaActions = require('./areaActions');
const categoryActions = require('./categoryActions');
const difficultyActions = require('./difficultyActions');
const ingredientActions = require('./ingredientActions');
const recipeActions = require('./recipeActions');
const seedActions = require('./seedActions');

const actions = {
    userActions: userActions,
    areaActions: areaActions,
    categoryActions: categoryActions,
    difficultyActions: difficultyActions,
    ingredientActions: ingredientActions,
    recipeActions: recipeActions,
    seedActions: seedActions
}

module.exports = actions;