/**
 * Represents a Recipe entity for interacting with the API.
 *
 * @class
 */
class Recipe {
    /**
     * Creates an instance of Recipe.
     *
     * @constructor
     * @param {Object} recipeData - The data representing a recipe.
     * @param {string} recipeData.name - The name of a recipe.
     */
    constructor(recipeData) {
        this.name = recipeData.name;
    }
}

module.exports = Recipe;
