/**
 * Filename: difficultyActions.js
 * Purpose: Aggregates all actions for the Difficulty entity.
 */
const mysql = require('mysql2');
const connectionOptions = require('./connectionOptions');

const { Difficulty } = require('../models');
const { objectIsValid } = require('../utils');

const getDifficulties = () => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM difficulty ORDER BY id", (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            const difficulties = result.map(r => new Difficulty(r));

            resolve({ statusCode: 200, responseMessage: difficulties });
        });

        connection.end();
    });
}

const getDifficulty = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM difficulty WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 404, responseMessage: err });
                return;
            }

            if (result.length === 0) {
                reject({ statusCode: 404, responseMessage: 'Difficulty not found.' });
                return;
            }

            const difficulty = new Difficulty(result[0]);

            resolve({ statusCode: 200, responseMessage: difficulty });
        });

        connection.end();
    });
}

const addDifficulty = (difficulty) => {
    return new Promise((resolve, reject) => {
        const newDifficulty = new Difficulty(difficulty);

        if (!objectIsValid(newDifficulty)) {
            reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("INSERT INTO difficulty (name) VALUES (?)", [newDifficulty.name], (err, result) => {
            if (err) {
                console.error(err);

                if (err.sqlMessage.startsWith('Duplicate entry')) {
                    return reject({ statusCode: 422, responseMessage: 'Name is duplicate.' });
                }

                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            newDifficulty.id = result.insertId;
            resolve({ statusCode: 200, responseMessage: newDifficulty });
        });

        connection.end();
    });
}

const editDifficulty = (id, difficulty) => {
    return new Promise((resolve, reject) => {
        const newDifficulty = new Difficulty(difficulty);

        if (!objectIsValid(newDifficulty)) {
            reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("UPDATE difficulty SET name = ? WHERE id = ?", [newDifficulty.name, id], (err, result) => {
            if (err) {
                console.error(err);

                if (err.sqlMessage.startsWith('Duplicate entry')) {
                    return reject({ statusCode: 422, responseMessage: 'Name is duplicate.' });
                }
                
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            if (result.affectedRows > 0) {
                newDifficulty.id = id;
                resolve({ statusCode: 200, responseMessage: newDifficulty });
            } else {
                reject({ statusCode: 404, responseMessage: 'Difficulty not found.' });
            }
        });

        connection.end();
    });
}

const deleteDifficulty = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("DELETE FROM difficulty WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            if (result.affectedRows > 0) {
                resolve({ statusCode: 200, responseMessage: 'Difficulty deleted successfully.' });
            } else {
                reject({ statusCode: 404, responseMessage: 'Difficulty not found.' });
            }
        });

        connection.end();
    });
}

module.exports.getDifficulties = getDifficulties;
module.exports.getDifficulty = getDifficulty;
module.exports.addDifficulty = addDifficulty;
module.exports.editDifficulty = editDifficulty;
module.exports.deleteDifficulty = deleteDifficulty;
