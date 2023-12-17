/**
 * Represents a User entity for interacting with the API.
 *
 * @class
 */
class User {
    /**
     * Creates an instance of Recipe.
     *
     * @constructor
     * @param {Object} userData - The data representing a user.
     * @param {string} userData.id - The id of a user.
     * @param {string} userData.username - The username of a user.
     * @param {string} userData.email - The id email a user.
     * @param {string} userData.password - The password of a user.
     * @param {string} userData.firstName - The first name of a user.
     * @param {string} userData.lastName - The last name of a user.
     */
    constructor(userData) {
        this.id = userData.id;
        this.username = userData.username;
        this.email = userData.email;
        this.password = userData.password;
        this.firstName = userData.firstName;
        this.lastName = userData.lastName;
    }
}

module.exports = User;
