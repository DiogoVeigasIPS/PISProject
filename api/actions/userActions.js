/**
 * Filename: userController.js
 * Purpose: Aggregates all actions for the User entity.
 */
const { User } = require('../models');
const { objectIsValid } = require('../utils');

const { users } = require('../temporaryData');

const getUsers = () => {
    return new Promise((resolve, reject) => {
        resolve({ statusCode: 200, responseMessage: users });
    });
}

const getUser = (id) => {
    return new Promise((resolve, reject) => {
        const user = users.find(u => u.id == id);
        if (user == null) {
            reject({ statusCode: 404, responseMessage: 'User not found.' });
            return;
        }
        resolve({ statusCode: 201, responseMessage: user })
    });
}

const addUser = (user) => {
    return new Promise((resolve, reject) => {
        const id = (users.length == 0) ? 1 : users.at(-1).id + 1;
        const newUser = new User(user, id);
        if (objectIsValid(newUser)) {
            users.push(newUser);
            resolve({ statusCode: 201, responseMessage: newUser });
            return;
        }
        reject({ statusCode: 400, responseMessage: 'Invalid body.' });
    })
}

const editUser = (id, user) => {
    return new Promise((resolve, reject) => {
        const newUser = new User(user, id);
        const oldUser = users.find(u => u.id == id);

        if (!objectIsValid(newUser)) {
            reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            return;
        }

        if (oldUser == null) {
            reject({ statusCode: 404, responseMessage: 'User not found.' });
            return;
        }

        for (prop in newUser) {
            oldUser[prop] = newUser[prop];
        }

        resolve({ statusCode: 200, responseMessage: oldUser });
    })
}

const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        const userIndex = users.findIndex(u => u.id == id);

        if (userIndex == -1) {
            reject({ statusCode: 404, responseMessage: 'User not found.' })
            return;
        }

        users.splice(userIndex, 1);

        resolve({ statusCode: 200, responseMessage: 'User deleted successfully' });
    })
}

module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.addUser = addUser;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;