/**
 * Filename: recipeController.js
 * Purpose: Aggregates all controllers for the Recipe entity.
 */
const { recipeActions } = require('../actions');
const { handlePromise } = require('../utils');

const readRecipes = (req, res) => {
    const query = req.query;

    const maxResults = query.max && !isNaN(query.max) ? parseInt(query.max) : undefined;
    const isRandom = query.random && query.random.toLowerCase() === 'true';
    const stringSearch = query.name ? query.name : null;
    const isPartial = query.partial && query.partial.toLowerCase() === 'true';

    const queryOptions = {
        maxResults: maxResults,
        isRandom: isRandom,
        stringSearch: stringSearch,
        isPartial: isPartial
    }

    handlePromise(recipeActions.getRecipes(queryOptions), res);
};

const readRecipe = (req, res) => {
    const id = req.params.id;
    handlePromise(recipeActions.getRecipe(id), res);
};

const addRecipe = (req, res) => {
    handlePromise(recipeActions.addRecipe(req.body), res);
};

const editRecipe = (req, res) => {
    const id = req.params.id;
    handlePromise(recipeActions.editRecipe(id, req.body), res);
};

const deleteRecipe = (req, res) => {
    const id = req.params.id;
    handlePromise(recipeActions.deleteRecipe(id), res);
};

module.exports.readRecipes = readRecipes;
module.exports.readRecipe = readRecipe;
module.exports.addRecipe = addRecipe;
module.exports.editRecipe = editRecipe;
module.exports.deleteRecipe = deleteRecipe;