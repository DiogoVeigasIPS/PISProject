/**
 * Filename: categoryActions.js
 * Purpose: Aggregates all actions for the Category entity.
 */
const mysql = require('mysql2');
const connectionOptions = require('./connectionOptions.json');

const { Category } = require('../models');
const { objectIsValid } = require('../utils');

const getCategories = (queryOptions = null) => {
    return new Promise((resolve, reject) => {
        var queryString = "SELECT * FROM category";
        const queryParams = [];

        if (queryOptions) {
            queryString += queryOptions.isRandom ? " ORDER BY RAND()" : "";

            if (queryOptions.maxResults) {
                queryString += " LIMIT ?";
                queryParams.push(queryOptions.maxResults);
            }
        } else {
            queryString += " ORDER BY id";
        }

        const connection = mysql.createConnection(connectionOptions);

        connection.connect();

        connection.query(queryString, queryParams, (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            const categories = result.map(r => new Category(r));

            resolve({ statusCode: 200, responseMessage: categories });
        });

        connection.end();
    });
}

const getCategory = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM category WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 404, responseMessage: err });
                return;
            }

            if (result.length === 0) {
                reject({ statusCode: 404, responseMessage: 'Category not found.' });
                return;
            }

            resolve({ statusCode: 200, responseMessage: result[0] });
        });

        connection.end();
    });
}

const addCategory = (category) => {
    return new Promise((resolve, reject) => {
        const newCategory = new Category(category);

        if (!objectIsValid(newCategory)) {
            reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("INSERT INTO category (name, description, image) VALUES (?, ?, ?)",
            [newCategory.name, newCategory.description, newCategory.image],
            (err, result) => {
                if (err) {
                    console.error(err);
                    reject({ statusCode: 400, responseMessage: err });
                    return;
                }

                newCategory.id = result.insertId;
                resolve({ statusCode: 200, responseMessage: newCategory });
            });

        connection.end();
    });
}

const editCategory = (id, category) => {
    return new Promise((resolve, reject) => {
        const newCategory = new Category(category);

        if (!objectIsValid(newCategory)) {
            reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("UPDATE category SET name = ?, description = ?, image = ? WHERE id = ?",
            [newCategory.name, newCategory.description, newCategory.image, id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    reject({ statusCode: 400, responseMessage: err });
                    return;
                }

                if (result.affectedRows > 0) {
                    const editedCategory = { id, name: newCategory.name, description: newCategory.description, image: newCategory.image };
                    resolve({ statusCode: 200, responseMessage: editedCategory });
                } else {
                    reject({ statusCode: 404, responseMessage: 'Category not found.' });
                }
            });

        connection.end();
    });
}

const deleteCategory = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("DELETE FROM category WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            if (result.affectedRows > 0) {
                resolve({ statusCode: 200, responseMessage: 'Category deleted successfully.' });
            } else {
                reject({ statusCode: 404, responseMessage: 'Category not found.' });
            }
        });

        connection.end();
    });
}

module.exports.getCategories = getCategories;
module.exports.getCategory = getCategory;
module.exports.addCategory = addCategory;
module.exports.editCategory = editCategory;
module.exports.deleteCategory = deleteCategory;
