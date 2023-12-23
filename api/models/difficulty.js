/**
 * Represents a Difficulty entity for interacting with the API.
 *
 * @class
 */
class Difficulty {
    /**
     * Creates an instance of Difficulty.
     *
     * @constructor
     * @param {Object} difficultyData - The data of a difficulty in the provider's API.
     * @param {string} difficulty.id - The id of a difficulty in the provider's API.
     * @param {string} difficulty.name - The name of a difficulty.
     */
    constructor(difficultyData) {
        this.id = difficultyData.id;
        this.name = difficultyData.name;
    }
}

module.exports = Difficulty;
