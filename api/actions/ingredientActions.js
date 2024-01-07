/**
 * Filename: ingredientActions.js
 * Purpose: Aggregates all actions for the Ingridient entity.
 */
const { Ingredient } = require('../models');
const { objectIsValid } = require('../utils');

const { ingredients } = require('../temporaryData');

const getIngredients = (queryOptions = null) => {
    return new Promise((resolve, reject) => {
        if (!queryOptions) {
            resolve({ statusCode: 200, responseMessage: ingredients });
            return;
        }

        const filteredByStringSearch = queryOptions.stringSearch
            ? ingredients.filter(ingredient => ingredient.name.toLowerCase().startsWith(queryOptions.stringSearch.toLowerCase()))
            : ingredients;

        const filteredIngredients = queryOptions.maxResults ? filteredByStringSearch.slice(0, queryOptions.maxResults) : filteredByStringSearch;

        resolve({ statusCode: 200, responseMessage: filteredIngredients });
    });
}

const getIngredient = (id) => {
    return new Promise((resolve, reject) => {
        const ingredient = ingredients.find(d => d.id == id)
        if (ingredient == null) {
            reject({ statusCode: 404, responseMessage: 'Ingredient not found.' });
            return;
        }
        resolve({ statusCode: 201, responseMessage: ingredient })
    });
}

const addIngredient = (ingredient) => {
    return new Promise((resolve, reject) => {
        const id = (ingredients.length == 0) ? 1 : ingredients.at(-1).id + 1;
        const newIngredient = new Ingredient(ingredient, id);
        if (objectIsValid(newIngredient)) {
            ingredients.push(newIngredient);
            resolve({ statusCode: 201, responseMessage: newIngredient });
            return ingredient;
        }
        reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
    })
}

const editIngredient = (id, ingredient) => {
    return new Promise((resolve, reject) => {
        const newIngredient = new Ingredient(ingredient, id);
        const oldIngredient = ingredients.find(c => c.id == id);

        if (!objectIsValid(newIngredient)) {
            reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            return;
        }

        if (oldIngredient == null) {
            reject({ statusCode: 404, responseMessage: 'Ingredient not found.' });
            return;
        }

        for (prop in newIngredient) {
            oldIngredient[prop] = newIngredient[prop];
        }

        resolve({ statusCode: 200, responseMessage: oldIngredient });
    })
}

const deleteIngredient = (id) => {
    return new Promise((resolve, reject) => {
        const ingredientIndex = ingredients.findIndex(c => c.id == id);

        if (ingredientIndex == -1) {
            reject({ statusCode: 404, responseMessage: 'Ingredient not found.' })
            return;
        }

        ingredients.splice(ingredientIndex, 1);

        resolve({ statusCode: 200, responseMessage: 'Ingredient deleted sucessfully.' });
    })
}

module.exports.getIngredients = getIngredients;
module.exports.getIngredient = getIngredient;
module.exports.addIngredient = addIngredient;
module.exports.editIngredient = editIngredient;
module.exports.deleteIngredient = deleteIngredient;