/**
 * Filename: userController.js
 * Purpose: Aggregates all controllers for the User entity.
 */
const { userActions } = require('../actions');
const { handlePromise } = require('../utils');

const readUsers = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }

    handlePromise(userActions.getUsers(), res);
};

const readUser = (req, res) => {
    const id = req.params.id;
    const isAdmin = req.isAdmin;
    const userId = req.userId;

    if (!(isAdmin || userId == id)) {
        return res.status(403).send('Forbidden.');
    }

    handlePromise(userActions.getUser(id), res);
};

const addUser = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }

    handlePromise(userActions.addUser(req.body), res);
};

const editUser = (req, res) => {
    const id = req.params.id;
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }
    
    handlePromise(userActions.editUser(id, req.body), res);
};

const deleteUser = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }
    
    const id = req.params.id;
    handlePromise(userActions.deleteUser(id), res);
};

const loginUser = (req, res) => {
    handlePromise(userActions.loginUser(req.body), res);
};

const signupUser = (req, res) => {
    handlePromise(userActions.signupUser(req.body), res);
};

const userIsLoggedIn = (req, res) => {
    const id = req.userId;
    const isAdmin = req.isAdmin;
    handlePromise(userActions.userIsLoggedIn(id, isAdmin), res);
};

const getFavorites = (req, res) => {
    const id = req.params.id;
    const userId = req.userId;

    if (!userId || id != userId) {
        return res.status(401).send('Not authenticated.');
    }

    const query = req.query;
    const isPartial = query.partial && query.partial.toLowerCase() === 'true';
    const isNamed = query.named && query.named.toLowerCase() === 'true';
    const maxResults = query.max && !isNaN(query.max) ? parseInt(query.max) : null;

    const queryOptions = {
        isPartial,
        isNamed,
        maxResults
    }

    handlePromise(userActions.getFavorites(queryOptions, id), res);
}

const addFavorite = (req, res) => {
    const id = req.params.id;
    const userId = req.userId;
    const recipe = req.params.recipe_id;
    
    if (!userId || id != userId) {
        return res.status(401).send('Not authenticated.');
    }

    handlePromise(userActions.addFavorite(id, recipe), res);
}

const removeFavorite = (req, res) => {
    const id = req.params.id;
    const userId = req.userId;
    const recipe = req.params.recipe_id;

    if (!userId || id != userId) {
        return res.status(401).send('Not authenticated.');
    }

    handlePromise(userActions.removeFavorite(id, recipe), res);
}

const changePassword = (req, res) => {
    const userId = req.userId;
    const id = req.params.id;

    if (!userId) {
        return res.status(401).send('Not authenticated.');
    }

    handlePromise(userActions.changePassword(userId, req.body), res);
}

const getRecipeLists = (req, res) => {
    const id = req.params.id;
    const userId = req.userId;

    if (!userId || id != userId) {
        return res.status(401).send('Not authenticated.');
    }

    handlePromise(userActions.getRecipeLists(userId), res);
}

const createRecipeList = (req, res) => {
    const id = req.params.id;
    const userId = req.userId;

    if (!userId || id != userId) {
        return res.status(401).send('Not authenticated.');
    }

    handlePromise(userActions.createRecipeList(userId, req.body), res);
}

const updateRecipeList = (req, res) => {
    const id = req.params.id;
    const list_id = req.params.list_id;
    const userId = req.userId;

    if (!userId || id != userId) {
        return res.status(401).send('Not authenticated.');
    }

    handlePromise(userActions.updateRecipeList(list_id, req.body, userId), res);
}

const deleteRecipeList = (req, res) => {
    const id = req.params.id;
    const list_id = req.params.list_id;
    const userId = req.userId;

    if (!userId || id != userId) {
        return res.status(401).send('Not authenticated.');
    }

    handlePromise(userActions.deleteRecipeList(list_id, userId), res);
}

const getRecipesInList = (req, res) => {
    const id = req.params.id;
    const listId = req.params.list_id;
    const userId = req.userId;

    if (!userId || id != userId) {
        return res.status(401).send('Not authenticated.');
    }

    const query = req.query;
    const isPartial = query.partial && query.partial.toLowerCase() === 'true';
    const isNamed = query.named && query.named.toLowerCase() === 'true';
    const maxResults = query.max && !isNaN(query.max) ? parseInt(query.max) : null;

    const queryOptions = {
        isPartial,
        isNamed,
        maxResults
    }

    handlePromise(userActions.getRecipesInList(queryOptions, listId, userId), res);
}

const addRecipeToList = (req, res) => {
    const id = req.params.id;
    const userId = req.userId;
    const listId = req.params.list_id;
    const recipeId = req.params.recipe_id;

    if (!userId || id != userId) {
        return res.status(401).send('Not authenticated.');
    }

    handlePromise(userActions.addRecipeToList(userId, listId, recipeId), res);
}

const deleteRecipeFromList = (req, res) => {
    const id = req.params.id;
    const userId = req.userId;
    const listId = req.params.list_id;
    const recipeId = req.params.recipe_id;

    if (!userId || id != userId) {
        return res.status(401).send('Not authenticated.');
    }

    handlePromise(userActions.deleteRecipeFromList(userId, listId, recipeId), res);
}

module.exports.readUsers = readUsers;
module.exports.readUser = readUser;
module.exports.addUser = addUser;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;
module.exports.loginUser = loginUser;
module.exports.signupUser = signupUser;
module.exports.userIsLoggedIn = userIsLoggedIn;
module.exports.getFavorites = getFavorites;
module.exports.addFavorite = addFavorite;
module.exports.removeFavorite = removeFavorite;
module.exports.changePassword = changePassword;
module.exports.getRecipeLists = getRecipeLists;
module.exports.createRecipeList = createRecipeList;
module.exports.updateRecipeList = updateRecipeList;
module.exports.deleteRecipeList = deleteRecipeList;
module.exports.getRecipesInList = getRecipesInList;
module.exports.addRecipeToList = addRecipeToList;
module.exports.deleteRecipeFromList = deleteRecipeFromList;