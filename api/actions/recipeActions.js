/**
 * Filename: recipeActions.js
 * Purpose: Aggregates all actions for the Recipe entity.
 */
const { Recipe } = require('../models');
const { objectIsValid } = require('../utils');

const { recipes } = require('../temporaryData');

// TODO (methods need change)

const getRecipes = () => {
    return new Promise((resolve, reject) => {
        resolve({ code: 200, msg: recipes});
    });
}

const getRecipe = (id) => {
    return new Promise((resolve, reject) => {
        const recipe = recipes.find(a => a.id == id)
        if (recipe == null) {
            reject({ code: 404, msg: 'Recipe not found.' });
        }
        resolve({ code: 201, msg: recipe})
    });
}

const addRecipe = (recipe) => {
    return new Promise((resolve, reject) => {
        const id = (recipes.length == 0) ? 1: recipes.at(-1).id + 1;
        const newRecipe = new Recipe(recipe, id);
        if (objectIsValid(newRecipe)){
            recipes.push(newRecipe);
            resolve({ code: 201, msg: newRecipe});
            return;
        }
        reject({ code: 400, msg: 'Invalid Body.' });
    })
}

const editRecipe = (id, recipe) => {
    return new Promise((resolve, reject) => {
        const newRecipe = new Recipe(recipe, id);
        const oldRecipe = recipes.find(a => a.id == id);

        if (!objectIsValid(newRecipe)) {
            reject({ code: 400, msg: 'Invalid body.' });
            return;
        }

        if (oldRecipe == null) {
            reject({ code: 404, msg: 'Recipe not found.' });
            return;
        }

        for (prop in newRecipe) {
            oldRecipe[prop] = newRecipe[prop];
        }

        resolve({ code: 200, msg: oldRecipe });
    })
}

const deleteRecipe = (id) => {
    return new Promise((resolve, reject) => {
        const recipeIndex = recipes.findIndex(a => a.id == id);

        if (recipeIndex == -1){
            reject({ code: 404, msg: 'Recipe not found.'})
            return;
        }

        recipes.splice(recipeIndex, 1);

        resolve({ code: 200, msg: 'Recipe deleted sucessfully.'});
    })
}

module.exports.getRecipes = getRecipes;
module.exports.getRecipe = getRecipe;
module.exports.addRecipe = addRecipe;
module.exports.editRecipe = editRecipe;
module.exports.deleteRecipe = deleteRecipe;