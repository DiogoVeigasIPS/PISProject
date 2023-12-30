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
     * @param {Ingredient} ingredientData.id - The id of an ingredient.
     * @param {string} ingredientData.quantity - The name of an ingredient.
     * @param {string} ingredientData.description - The description of an ingredient.
     */
    constructor(ingredientData, id = ingredientData.id) {
        this.id = id;
        this.name = ingredientData.name;
        this.description = ingredientData.description;
    }
}

module.exports = IngredientInRecipe;
