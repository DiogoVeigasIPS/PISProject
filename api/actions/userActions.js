/**
 * Filename: userController.js
 * Purpose: Aggregates all actions for the User entity.
 */
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
let dotenv = require('dotenv').config()
const connectionOptions = require('./connectionOptions');

const { User } = require('../models');
const { objectIsValid } = require('../utils');
const { getJWT } = require('../jsonWebToken');

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
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            if (result.length == 0) {
                reject({ statusCode: 404, responseMessage: 'User not found.' });
                return;
            }

            const user = new User(result[0]);

            resolve({ statusCode: 200, responseMessage: user });
        });

        connection.end();
    });
}

const addUser = (user) => {
    return new Promise(async (resolve, reject) => {
        const newUser = new User(user);

        if (!objectIsValid(newUser)) {
            reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;

        connection.query("INSERT INTO user (username, email, password, firstName, lastName, image) VALUES (?, ?, ?, ?, ?, ?)",
            [newUser.username, newUser.email, newUser.password, newUser.firstName, newUser.lastName, newUser.image],
            (err, result) => {
                if (err) {
                    if (err.sqlMessage.startsWith('Duplicate entry')) {
                        return reject({ statusCode: 400, responseMessage: 'Username or email is duplicate.' });
                    }

                    reject({ statusCode: 400, responseMessage: err });
                    return;
                }

                newUser.id = result.insertId;
                resolve({ statusCode: 200, responseMessage: newUser });
            });

        connection.end();
    });
}

const editUser = (id, user) => {
    return new Promise(async (resolve, reject) => {
        const newUser = new User(user);

        if (!objectIsValid(newUser)) {
            reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;

        connection.query("UPDATE user SET username = ?, email = ?, password = ?, firstName = ?, lastName = ?, image = ?, isAdmin = ? WHERE id = ?",
            [newUser.username, newUser.email, newUser.password, newUser.firstName, newUser.lastName, newUser.image, id, newUser.isAdmin ? 1 : 0],
            (err, result) => {
                if (err) {
                    console.error(err);
                    reject({ statusCode: 400, responseMessage: err });
                    return;
                }

                if (result.affectedRows > 0) {
                    newUser.id = id;
                    resolve({ statusCode: 200, responseMessage: newUser });
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
                reject({ statusCode: 400, responseMessage: err });
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
    return new Promise(async (resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM user WHERE username = ?", [username], async (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            const user = result[0];

            if (!user) {
                reject({ statusCode: 404, responseMessage: 'User not found.' });
                return;
            }

            try {
                const isPasswordMatch = await bcrypt.compare(password, user.password);

                if (!isPasswordMatch) {
                    reject({ statusCode: 401, responseMessage: 'Incorrect password.' });
                    return;
                }

                const response = getJWT(user);
                resolve({ statusCode: 200, responseMessage: response });
            } catch (error) {
                console.error(error);
                reject({ statusCode: 500, responseMessage: 'Something went wrong.' });
            } finally {
                connection.end();
            }
        });
    });
};

const signupUser = ({ username, email, password, repeatPassword, firstName, lastName }) => {
    return new Promise(async (resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

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
            const user = new User({
                username: username,
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                token: null
            });

            const addedUser = (await addUser(user)).responseMessage;

            const response = getJWT(addedUser);
            resolve({ statusCode: 200, responseMessage: response });
        } catch (error) {
            console.error(error);
            reject({ statusCode: error.statusCode, responseMessage: error.responseMessage });
        } finally {
            connection.end();
        }
    });
};

const userIsLoggedIn = (userId) => {
    return new Promise((resolve, reject) => {
        if (userId == null) {
            return reject({ statusCode: 401, responseMessage: { auth: false } });
        }

        resolve({ statusCode: 200, responseMessage: { auth: true, id: userId } });
    });
}

module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.addUser = addUser;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;
module.exports.loginUser = loginUser;
module.exports.signupUser = signupUser;
module.exports.userIsLoggedIn = userIsLoggedIn;
