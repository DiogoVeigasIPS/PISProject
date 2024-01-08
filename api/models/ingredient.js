/**
 * Represents a Ingredient entity for interacting with the API.
 *
 * @class
 */
class Ingredient {
    /**
     * Creates an instance of Ingredient.
     *
     * @constructor
     * @param {Object} ingredientData - The data representing an ingridient.
     * @param {string} ingredient.id - The id of an ingredient.
     * @param {string} ingredient.name - The name of an ingredient.
     * @param {string} ingredient.description - The description of an ingredient.
     */
    constructor(ingredientData, id = ingredientData.id) {
        this.id = id;
        this.name = ingredientData.name;
        this.description = ingredientData.description;
    }
}

module.exports = Ingredient;
