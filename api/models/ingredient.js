/**
 * Represents a Ingredient entity for interacting with the API.
 *
 * @class
 */
class Ingredient {
    /**
     * Creates an instance of Recipe.
     *
     * @constructor
     * @param {Object} ingredientData - The id of a recipe in the provider's API.
     * @param {string} ingredient.name - The id of a recipe in the provider's API.
     * @param {string} ingredient.quantity - The name of a recipe.
     */
    constructor(ingredientData) {
        this.name = ingredientData.name;
        this.quantity = ingredientData.quantity;
    }
}

module.exports = Ingredient;
