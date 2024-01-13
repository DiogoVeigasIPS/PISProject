/**
 * Filename: recipeController.js
 * Purpose: Aggregates all controllers for the Recipe entity.
 */
const { recipeActions } = require('../actions');
const { handlePromise } = require('../utils');

const readRecipes = (req, res) => {
    const query = req.query;

    const maxResults = query.max && !isNaN(query.max) ? parseInt(query.max) : null;
    const isRandom = query.random && query.random.toLowerCase() === 'true';
    const stringSearch = query.name ? query.name : null;
    const isPartial = query.partial && query.partial.toLowerCase() === 'true';
    const area = query.area && !isNaN(query.area) ? parseInt(query.area) : null;
    const category = query.category && !isNaN(query.category) ? parseInt(query.category) : null;

    const queryOptions = {
        maxResults: maxResults,
        isRandom: isRandom,
        stringSearch: stringSearch,
        isPartial: isPartial,
        area: area,
        category: category
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

const addIngredientToRecipe = (req, res) => {
    const recipe = req.params.id;
    const ingredient = req.body.ingredientId;
    const quantity = req.body.quantity;

    handlePromise(recipeActions.addIngredientToRecipe(recipe, ingredient, quantity), res);
};

const editIngredientQuantityInRecipe = (req, res) => {
    const recipe = req.params.id;
    const ingredient = req.body.ingredientId;
    const quantity = req.body.quantity;

    handlePromise(recipeActions.editIngredientQuantityInRecipe(recipe, ingredient, quantity), res);
};

const removeIngredientFromRecipe = (req, res) => {
    const recipe = req.params.id;
    const ingredient = req.body.ingredientId;

    handlePromise(recipeActions.removeIngredientFromRecipe(recipe, ingredient), res);
};

module.exports.readRecipes = readRecipes;
module.exports.readRecipe = readRecipe;
module.exports.addRecipe = addRecipe;
module.exports.editRecipe = editRecipe;
module.exports.deleteRecipe = deleteRecipe;
module.exports.addIngredientToRecipe = addIngredientToRecipe;
module.exports.editIngredientQuantityInRecipe = editIngredientQuantityInRecipe;
module.exports.removeIngredientFromRecipe = removeIngredientFromRecipe;