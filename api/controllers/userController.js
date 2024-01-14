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
    const id = req.params.id;
    handlePromise(userActions.deleteUser(id), res);
};

const loginUser = (req, res) => {
    handlePromise(userActions.loginUser(req.body), res);
};

const signupUser = (req, res) => {
    handlePromise(userActions.signupUser(req.body), res);
};

const isLoggedIn = (req, res) => {
    const token = req.headers['x-access-token'];
    handlePromise(userActions.isLoggedIn(token), res);
};

module.exports.readUsers = readUsers;
module.exports.readUser = readUser;
module.exports.addUser = addUser;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;
module.exports.loginUser = loginUser;
module.exports.signupUser = signupUser;
module.exports.isLoggedIn = isLoggedIn;