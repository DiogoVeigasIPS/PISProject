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
     * @param {number} recipeData.id - The id of a recipe.
     * @param {string} recipeData.name - The name of a recipe.
     * @param {string} recipeData.category - The category of a recipe.
     * @param {string} recipeData.description - The description of a recipe.
     * @param {string} recipeData.area - The area of origin of a recipe.
     * @param {string} recipeData.author - The author of a recipe.
     * @param {Ingredient[]} recipeData.ingredients - A collection of all ingredients.
     * @param {string} recipeData.image - The url of the image of a recipe.
     * @param {string} recipeData.preparationTime - The preparation time of a recipe.
     * @param {string} recipeData.difficulty - The difficulty to cook a recipe.
     * @param {string} recipeData.cost - The cost of a recipe.
     */
    constructor(recipeData) {
        this.id = recipeData.id;
        this.name = recipeData.name;
        this.category = recipeData.category;
        this.description = recipeData.description;
        this.area = recipeData.area;
        this.author = recipeData.author;
        this.ingredients = recipeData.ingredients;
        this.image = recipeData.image;
        this.preparationTime = recipeData.preparationTime;
        this.difficulty = recipeData.difficulty;
        this.cost = recipeData.cost;
    }
}

module.exports = Recipe;
