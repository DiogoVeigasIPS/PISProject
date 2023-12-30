/**
 * Filename: ingredientController.js
 * Purpose: Aggregates all controllers for the Ingredient entity.
 */

const { ingredientActions } = require('../actions');
const { handlePromise } = require('../utils');

const readIngredients = (req, res) => {
    handlePromise(ingredientActions.getIngredients(), res);
};

const readIngredient = (req, res) => {
    const id = req.params.id;
    handlePromise(ingredientActions.getIngredient(id), res);
};

const addIngredient = (req, res) => {
    handlePromise(ingredientActions.addIngredient(req.body), res);
};

const editIngredient = (req, res) => {
    const id = req.params.id;
    handlePromise(ingredientActions.editIngredient(id, req.body), res);
};

const deleteIngredient = (req, res) => {
    const id = req.params.id;
    handlePromise(ingredientActions.deleteIngredient(id), res);
};

module.exports.readIngredients = readIngredients;
module.exports.readIngredient = readIngredient;
module.exports.addIngredient = addIngredient;
module.exports.editIngredient = editIngredient;
module.exports.deleteIngredient = deleteIngredient;