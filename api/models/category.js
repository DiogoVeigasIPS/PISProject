/**
 * Represents a Category entity for interacting with the API.
 *
 * @class
 */
class Category {
    /**
     * Creates an instance of category.
     *
     * @constructor
     * @param {Object} categoryData - The data representing a category.
     * @param {int} categoryData.id - The id of a category.
     * @param {string} categoryData.name - The name of a category.
     * @param {string} categoryData.description - The description of a category.
     * @param {string} categoryData.image - The image of a category.
     */
    constructor(categoryData) {
        this.id = categoryData.id;
        this.name = categoryData.name;
        this.description = categoryData.description;
        this.image = categoryData.image;    
    }
}

module.exports = Category;
