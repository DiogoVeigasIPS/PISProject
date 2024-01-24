/**
 * Filename: utils.js
 * Purpose: Functions that help process data before showing it with mustache template.
 */

/**
 * [prepareRecipe] - Receives a recipe from our API and returns it without null values, but default values.
 *
 * @param {Recipe} recipe - Recipe from the API.
 * @returns {Recipe} - The processed recipe with no null values.
 */
const prepareRecipe = (recipe) => {
    const defaultValue = "Not Provided";

    if (recipe.author?.username == null) {
        recipe.author = { username: defaultValue }
    }
    if (recipe.difficulty?.name == null) {
        recipe.difficulty = { name: defaultValue }
    }

    for (const prop in recipe) {
        if (!recipe[prop]) {
            recipe[prop] = defaultValue;
        }
    }
    return recipe;
}

module.exports.prepareRecipe = prepareRecipe;