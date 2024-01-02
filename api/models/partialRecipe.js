/**
 * Represents a partial Recipe entity, which will be used to optimize performance on list based operations.
 *
 * @class
 */
class PartialRecipe {
    /**
     * Creates an instance of Recipe.
     *
     * @constructor
     * @param {Object} recipeData - The data representing a recipe.
     * @param {number} recipeData.id - The id of a recipe.
     * @param {number} recipeData.idProvider - The id of a recipe in the provider's API.
     * @param {string} recipeData.name - The name of a recipe.
     * @param {string} recipeData.image - The url of the image of a recipe.
     */
    constructor(recipeData, id = recipeData.id) {
        this.id = id;
        this.idProvider = recipeData.idProvider;
        this.name = recipeData.name;
        this.image = recipeData.image;
    }
}

module.exports = PartialRecipe;
