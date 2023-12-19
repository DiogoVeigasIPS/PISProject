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

module.exports.readUsers = readUsers;
module.exports.readUser = readUser;
module.exports.addUser = addUser;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;