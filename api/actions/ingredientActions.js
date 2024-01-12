/**
 * Filename: ingredientActions.js
 * Purpose: Aggregates all actions for the Ingredient entity.
 */
const mysql = require('mysql2');
const connectionOptions = require('./connectionOptions.json');

const { Ingredient } = require('../models');
const { objectIsValid } = require('../utils');

const getIngredients = (queryOptions = null) => {
    return new Promise((resolve, reject) => {
        const queryString = queryOptions
            ? "SELECT * FROM ingredient" +
            (queryOptions.stringSearch ? " WHERE name LIKE ?" : "") +
            (queryOptions.isRandom ? " ORDER BY RAND()" : "") +
            (queryOptions.maxResults ? " LIMIT ?" : "")
            : "SELECT * FROM ingredient ORDER BY id";

        const queryParams = [];
        if (queryOptions.stringSearch) { queryParams.push(`%${queryOptions.stringSearch}%`); }
        if (queryOptions.maxResults) { queryParams.push(queryOptions.maxResults); }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query(queryString, queryParams, (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            const ingredients = result.map(r => new Ingredient(r));

            resolve({ statusCode: 200, responseMessage: ingredients });
            connection.end();
        });
    });
};

const getIngredient = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM ingredient WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 404, responseMessage: err });
                return;
            }

            if (result.length === 0) {
                reject({ statusCode: 404, responseMessage: 'Ingredient not found.' });
                return;
            }

            resolve({ statusCode: 200, responseMessage: result[0] });
        });

        connection.end();
    });
}

const addIngredient = (ingredient) => {
    return new Promise((resolve, reject) => {
        const newIngredient = new Ingredient(ingredient);

        if (!objectIsValid(newIngredient)) {
            reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("INSERT INTO ingredient (name, description, image) VALUES (?, ?, ?)",
            [newIngredient.name, newIngredient.description, newIngredient.image],
            (err, result) => {
                if (err) {
                    console.error(err);
                    reject({ statusCode: 400, responseMessage: err });
                    return;
                }

                newIngredient.id = result.insertId;
                resolve({ statusCode: 200, responseMessage: newIngredient });
            });

        connection.end();
    });
}

const editIngredient = (id, ingredient) => {
    return new Promise((resolve, reject) => {
        const newIngredient = new Ingredient(ingredient);

        if (!objectIsValid(newIngredient)) {
            reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("UPDATE ingredient SET name = ?, description = ?, image = ? WHERE id = ?",
            [newIngredient.name, newIngredient.description, newIngredient.image, id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    reject({ statusCode: 400, responseMessage: err });
                    return;
                }

                if (result.affectedRows > 0) {
                    const editedIngredient = { id, name: newIngredient.name, description: newIngredient.description, image: newIngredient.image };
                    resolve({ statusCode: 200, responseMessage: editedIngredient });
                } else {
                    reject({ statusCode: 404, responseMessage: 'Ingredient not found.' });
                }
            });

        connection.end();
    });
}

const deleteIngredient = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("DELETE FROM ingredient WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            if (result.affectedRows > 0) {
                resolve({ statusCode: 200, responseMessage: 'Ingredient deleted successfully.' });
            } else {
                reject({ statusCode: 404, responseMessage: 'Ingredient not found.' });
            }
        });

        connection.end();
    });
}

module.exports.getIngredients = getIngredients;
module.exports.getIngredient = getIngredient;
module.exports.addIngredient = addIngredient;
module.exports.editIngredient = editIngredient;
module.exports.deleteIngredient = deleteIngredient;
