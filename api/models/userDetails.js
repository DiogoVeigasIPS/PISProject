/**
 * Represents a UserDetails entity for interacting with the API.
 *
 * @class
 */
class UserDetails {
    /**
     * Creates an instance of UserDetails.
     *
     * @constructor
     * @param {Object} userDetailsData - The data representing a user with his details.
     * @param {Recipe[]} userDetailsData.favoriteRecipes - The list of favorite recipes of a user.
     * @param {RecipeList[]} userDetailsData.recipeLists - The lists the user created to store recipes.
     */
    constructor(userDetailsData, id = userDetailsData.id) {
        this.id = id;
        this.favoriteRecipes = userDetailsData.favoriteRecipes;
        this.recipeLists = userDetailsData.recipeLists;
    }
}

module.exports = UserDetails;
