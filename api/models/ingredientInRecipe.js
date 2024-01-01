/**
 * Represents a IngredientInRecipe entity for interacting with the API.
 *
 * @class
 */
class IngredientInRecipe {
    /**
     * Creates an instance of Recipe.
     *
     * @constructor
     * @param {Object} ingredientInRecipeData - The data representing a ingredient in a recipe.
     * @param {Ingredient} ingredientInRecipeData.ingredient - The id of an ingredient.
     * @param {string} ingredientInRecipeData.quantity - The name of an ingredient.
     */
    constructor(ingredientInRecipeData) {
        this.ingredient = ingredientInRecipeData.ingredient;
        this.quantity = ingredientInRecipeData.quantity;
    }
}

module.exports = IngredientInRecipe;
