/**
 * Represents a RecipeList entity for interacting with the API.
 *
 * @class
 */
class RecipeList {
    /**
     * Creates an instance of RecipeList.
     *
     * @constructor
     * @param {Object} recipeListData - The data representing a recipe list.
     * @param {number} recipeListData.id - The id of a list.
     * @param {string} recipeListData.name - The name of a list.
     * @param {PartialRecipe[]} recipeListData.recipes - The recipes inside that list.
     */
    constructor(recipeListData, id = recipeListData.id) {
        this.id = id;
        this.name = recipeListData.name;
        this.id = recipeListData.recipes;
    }
}

module.exports = RecipeList;
