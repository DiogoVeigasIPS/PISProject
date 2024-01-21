/**
 * Filename: userController.js
 * Purpose: Aggregates all controllers for the User entity.
 */
const { userActions } = require('../actions');
const { handlePromise } = require('../utils');

const readUsers = (req, res) => {
    handlePromise(userActions.getUsers(), res);
};

const readUser = (req, res) => {
    const id = req.params.id;
    handlePromise(userActions.getUser(id), res);
};

const addUser = (req, res) => {
    handlePromise(userActions.addUser(req.body), res);
};

const editUser = (req, res) => {
    const id = req.params.id;
    handlePromise(userActions.editUser(id, req.body), res);
};

const deleteUser = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Not authorized.');
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
    const recipe = req.params.recipe_id;
    handlePromise(userActions.addFavorite(id, recipe), res);
}

const removeFavorite = (req, res) => {
    const id = req.params.id;
    const recipe = req.params.recipe_id;
    handlePromise(userActions.removeFavorite(id, recipe), res);
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