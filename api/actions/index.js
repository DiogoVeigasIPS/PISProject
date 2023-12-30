/**
 * Filename: index.js
 * Purpose: Aggregates all actions.
 */
const userActions = require('./userActions');
const areaActions = require('./areaActions');

const actions = {
    userActions: userActions,
    areaActions: areaActions
}

module.exports = actions;