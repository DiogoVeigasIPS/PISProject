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
     * @param {Object} difficultyData - The data representing a difficulty.
     * @param {string} difficultyData.id - The id of a difficulty.
     * @param {string} difficultyData.name - The name of a difficulty.
     */
    constructor(difficultyData, id = difficultyData.id) {
        this.id = id;
        this.name = difficultyData.name;
    }
}

module.exports = Difficulty;
