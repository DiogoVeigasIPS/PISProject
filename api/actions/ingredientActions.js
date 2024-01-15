/**
 * Filename: ingredientActions.js
 * Purpose: Aggregates all actions for the Ingredient entity.
 */
const mysql = require('mysql2');
const connectionOptions = require('./connectionOptions');

const { Ingredient } = require('../models');
const { objectIsValid } = require('../utils');

const getIngredients = (queryOptions = null) => {
    return new Promise((resolve, reject) => {
        const baseQueryString = "SELECT * FROM ingredient";
        let queryString = baseQueryString;

        const queryParams = [];

        if (queryOptions) {
            queryString += queryOptions.stringSearch ? " WHERE name LIKE ?" : "";
            queryString += queryOptions.isRandom ? " ORDER BY RAND()" : "";
            queryString += queryOptions.order ? ` ORDER BY ${queryOptions.order} ${queryOptions.by}` : "";
            queryString += queryOptions.maxResults ? " LIMIT ?" : "";

            if (queryOptions.stringSearch) {
                queryParams.push(`%${queryOptions.stringSearch}%`);
            }
            if (queryOptions.maxResults) {
                queryParams.push(queryOptions.maxResults);
            }
        }

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

        });

        connection.end();
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

            const ingredient = new Ingredient(result[0]);

            resolve({ statusCode: 200, responseMessage: ingredient });
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
                    newIngredient.id = id;
                    resolve({ statusCode: 200, responseMessage: newIngredient });
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

const truncateIngredients = () => {
    return new Promise((resolve, reject) => {
        const multipleStatementsOptions = { ...connectionOptions };
        multipleStatementsOptions.multipleStatements = true;

        const connection = mysql.createConnection(multipleStatementsOptions);
        connection.connect();

        const queryString = "SET FOREIGN_KEY_CHECKS = 0; TRUNCATE TABLE ingredient; SET FOREIGN_KEY_CHECKS = 1;";

        connection.query(queryString, (truncateErr, truncateResult) => {
            if (truncateErr) {
                console.error(truncateErr);
                reject({ statusCode: 500, responseMessage: truncateErr });
                return;
            }

            resolve({ statusCode: 200, responseMessage: 'Ingredients truncated sucessfully.' });

            connection.end();
        });
    });
};

const addIngredients = (ingredients) => {
    return new Promise((resolve, reject) => {
        const newIngredients = ingredients.map(i => new Ingredient(i));

        for (const newIngredient of newIngredients) {
            if (!objectIsValid(newIngredient)) {
                reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
            }
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        const values = newIngredients.map(newIngredient => [newIngredient.name, newIngredient.description, newIngredient.image]);

        connection.query("INSERT INTO ingredient(name, description, image) VALUES ?", [values], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            for (let i = 0; i < result.affectedRows; i++) {
                newIngredients[i].id = result.insertId + i;
            }

            resolve({ statusCode: 200, responseMessage: newIngredients });
            connection.end();
        })
    })
}

module.exports.getIngredients = getIngredients;
module.exports.getIngredient = getIngredient;
module.exports.addIngredient = addIngredient;
module.exports.editIngredient = editIngredient;
module.exports.deleteIngredient = deleteIngredient;
module.exports.truncateIngredients = truncateIngredients;
module.exports.addIngredients = addIngredients;