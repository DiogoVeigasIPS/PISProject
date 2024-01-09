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
     * @param {string} ingredientData.id - The id of an ingredient.
     * @param {string} ingredientData.name - The name of an ingredient.
     * @param {string} ingredientData.description - The description of an ingredient.
     * @param {string} ingredientData.image - The image of an ingredient.
     */
    constructor(ingredientData, id = ingredientData.id) {
        this.id = id;
        this.name = ingredientData.name;
        this.description = ingredientData.description;
        this.image = ingredientData.image;
    }
}

module.exports = Ingredient;
