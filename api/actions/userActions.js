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
    return new Promise((resolve, reject) => {
        const newUser = new User(user);

        if (!objectIsValid(newUser)) {
            reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("INSERT INTO user (username, email, password, firstName, lastName) VALUES (?, ?, ?, ?, ?)",
            [newUser.username, newUser.email, newUser.password, newUser.firstName, newUser.lastName],
            (err, result) => {
                if (err) {
                    console.error(err);
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
                    reject({ statusCode: 400, responseMessage: err });
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

                const id = user.id;
                const token = jwt.sign({ id }, dotenv.parsed.SECRET_WORD, {
                    expiresIn: 60 * 60
                });

                const response = { auth: true, token: token };
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
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                username: username,
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                token: null
            });

            await addUser(user);

            const id = user.id;
            const token = jwt.sign({ id }, dotenv.parsed.SECRET_WORD, {
                expiresIn: 60 * 60
            });

            const response = { auth: true, token: token };
            resolve({ statusCode: 200, responseMessage: response });
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

const isLoggedIn = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            const response = { auth: false, message: 'No token provided.' };
            reject({ statusCode: 500, responseMessage: response });
        }

        jwt.verify(token, dotenv.parsed.SECRET_WORD, function (err, decoded) {
            if (err) {
                const response = { auth: false, id: null }
                reject({ statusCode: 500, responseMessage: response });
            }

            const response = { auth: true, id: decoded.id }
            resolve({ statusCode: 200, responseMessage: response });
        });
    })
}

module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.addUser = addUser;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;
module.exports.loginUser = loginUser;
module.exports.signupUser = signupUser;
module.exports.isLoggedIn = isLoggedIn;

