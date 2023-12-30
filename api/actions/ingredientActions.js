/**
 * Filename: ingredientActions.js
 * Purpose: Aggregates all actions for the Ingridient entity.
 */
const { Ingredient } = require('../models');
const { objectIsValid } = require('../utils');

const { ingredients } = require('../temporaryData');

const getIngredients = () => {
    return new Promise((resolve, reject) => {
        resolve({ code: 200, msg: ingredients});
    });
}

const getIngredient = (id) => {
    return new Promise((resolve, reject) => {
        const ingredient = ingredients.find(d => d.id == id)
        if (ingredient == null) {
            reject({ code: 404, msg: 'Ingredient not found.' });
        }
        resolve({ code: 201, msg: ingredient})
    });
}

const addIngredient = (ingredient) => {
    return new Promise((resolve, reject) => {
        const id = (ingredients.length == 0) ? 1: ingredients.at(-1).id + 1;
        const newIngredient = new Ingredient(ingredient, id);
        if (objectIsValid(newIngredient)){
            ingredients.push(newIngredient);
            resolve({ code: 201, msg: newIngredient});
            return;
        }
        reject({ code: 400, msg: 'Invalid Body.' });
    })
}

const editIngredient = (id, ingredient) => {
    return new Promise((resolve, reject) => {
        const newIngredient = new Ingredient(ingredient, id);
        const oldIngredient = ingredients.find(c => c.id == id);

        if (!objectIsValid(newIngredient)) {
            reject({ code: 400, msg: 'Invalid body.' });
            return;
        }

        if (oldIngredient == null) {
            reject({ code: 404, msg: 'Ingredient not found.' });
            return;
        }

        for (prop in newIngredient) {
            oldIngredient[prop] = newIngredient[prop];
        }

        resolve({ code: 200, msg: oldIngredient });
    })
}

const deleteIngredient = (id) => {
    return new Promise((resolve, reject) => {
        const ingredientIndex = ingredients.findIndex(c => c.id == id);

        if (ingredientIndex == -1){
            reject({ code: 404, msg: 'Ingredient not found.'})
            return;
        }

        ingredients.splice(ingredientIndex, 1);

        resolve({ code: 200, msg: 'Ingredient deleted sucessfully.'});
    })
}

module.exports.getIngredients = getIngredients;
module.exports.getIngredient = getIngredient;
module.exports.addIngredient = addIngredient;
module.exports.editIngredient = editIngredient;
module.exports.deleteIngredient = deleteIngredient;