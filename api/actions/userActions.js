/**
 * Filename: userController.js
 * Purpose: Aggregates all actions for the User entity.
 */

const mysql = require('mysql2');
const connectionOptions = require('./connectionOptions.json');

const { User } = require('../models');
const { objectIsValid } = require('../utils');

const getUsers = () => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM user ORDER BY id", (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            const users = result.map(r => new User(r));

            resolve({ statusCode: 200, responseMessage: users });
        });

        connection.end();
    });
}

const getUser = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM user WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 404, responseMessage: err });
                return;
            }

            if (result.length == 0) {
                reject({ statusCode: 404, responseMessage: 'User not found.' });
                return;
            }

            resolve({ statusCode: 200, responseMessage: result[0] });
        });

        connection.end();
    });
}

const addUser = (user) => {
    return new Promise((resolve, reject) => {
        const newUser = new User(user);

        if (!objectIsValid(newUser)) {
            reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("INSERT INTO user (username, email, password, firstName, lastName, token) VALUES (?, ?, ?, ?, ?, ?)",
            [newUser.username, newUser.email, newUser.password, newUser.firstName, newUser.lastName, newUser.token],
            (err, result) => {
                if (err) {
                    console.error(err);
                    reject({ statusCode: 404, responseMessage: err });
                    return;
                }

                newUser.id = result.insertId;
                resolve({ statusCode: 200, responseMessage: newUser });
            });

        connection.end();
    });
}

const editUser = (id, user) => {
    return new Promise((resolve, reject) => {
        const newUser = new User(user);

        if (!objectIsValid(newUser)) {
            reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("UPDATE user SET username = ?, email = ?, password = ?, firstName = ?, lastName = ?, token = ? WHERE id = ?",
            [newUser.username, newUser.email, newUser.password, newUser.firstName, newUser.lastName, newUser.token, id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    reject({ statusCode: 404, responseMessage: err });
                    return;
                }

                if (result.affectedRows > 0) {
                    const editedUser = { id, ...newUser };
                    resolve({ statusCode: 200, responseMessage: editedUser });
                } else {
                    reject({ statusCode: 404, responseMessage: 'User not found.' });
                }
            });

        connection.end();
    });
}

const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("DELETE FROM user WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 404, responseMessage: err });
                return;
            }

            if (result.affectedRows > 0) {
                resolve({ statusCode: 200, responseMessage: 'User deleted successfully.' });
            } else {
                reject({ statusCode: 404, responseMessage: 'User not found.' });
            }
        });

        connection.end();
    });
}

const loginUser = ({ username, password }) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM user WHERE username = ? AND password = ?", [username, password], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            const user = result[0];

            if (!user) {
                reject({ statusCode: 404, responseMessage: 'User not found.' });
                return;
            }

            resolve({ statusCode: 200, responseMessage: 'User logged in successfully' });
        });

        connection.end();
    });
}

const signupUser = ({ username, email, password, repeatPassword, firstName, lastName }) => {
    return new Promise(async (resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        const isDuplicate = await checkDuplicateUser(connection, username, email);

        if (isDuplicate) {
            reject({ statusCode: 404, responseMessage: 'Username or Email already in use.' });
            return;
        }

        if (password.length < 4) {
            reject({ statusCode: 404, responseMessage: 'Password is too small.' });
            return;
        }

        if (password.length > 30) {
            reject({ statusCode: 404, responseMessage: 'Password is too big.' });
            return;
        }

        if (password !== repeatPassword) {
            reject({ statusCode: 404, responseMessage: 'Passwords must be equal.' });
            return;
        }

        try {
            await addUser(
                new User({
                    username: username,
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    token: null
                })
            );
            resolve({ statusCode: 200, responseMessage: 'User signed up successfully' });
        } catch (error) {
            console.error(error);
            reject({ statusCode: 500, responseMessage: 'Something went wrong.' });
        } finally {
            connection.end();
        }
    });
};

const checkDuplicateUser = async (connection, username, email) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM user WHERE username = ? OR email = ?", [username, email], (err, result) => {
            if (err) {
                console.error(err);
                reject(false);
                return;
            }

            resolve(result.length > 0);
        });
    });
}

module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.addUser = addUser;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;
module.exports.loginUser = loginUser;
module.exports.signupUser = signupUser;
