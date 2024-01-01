/**
 * Represents a Author entity to represent a user as an author.
 *
 * @class
 */
class User {
    /**
     * Creates an instance of Recipe.
     *
     * @constructor
     * @param {Object} authorData - The data representing a user.
     * @param {string} authorData.id - The id of a user.
     * @param {string} authorData.username - The username of a user.
     * @param {string} authorData.firstName - The first name of a user.
     * @param {string} authorData.lastName - The last name of a user.
     */
    constructor(authorData, id = authorData.id) {
        this.id = id;
        this.username = authorData.username;
        this.firstName = authorData.firstName;
        this.lastName = authorData.lastName;
    }
}

module.exports = User;
