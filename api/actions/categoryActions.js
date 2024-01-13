/**
 * Filename: categoryActions.js
 * Purpose: Aggregates all actions for the Category entity.
 */
const mysql = require('mysql2');
const connectionOptions = require('./connectionOptions.json');

const { Category } = require('../models');
const { objectIsValid } = require('../utils');

const getCategories = (queryOptions = null, connection = null) => {
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
};

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

            const category = new Category(result[0]);

            resolve({ statusCode: 200, responseMessage: category });
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
                    newCategory.id = id;
                    resolve({ statusCode: 200, responseMessage: newCategory });
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

const truncateCategories = () => {
    return new Promise((resolve, reject) => {
        const multipleStatementsOptions = { ...connectionOptions };
        multipleStatementsOptions.multipleStatements = true;

        const connection = mysql.createConnection(multipleStatementsOptions);
        connection.connect();

        const queryString = "SET FOREIGN_KEY_CHECKS = 0; TRUNCATE TABLE category; SET FOREIGN_KEY_CHECKS = 1;";

        connection.query(queryString, (truncateErr, truncateResult) => {
            if (truncateErr) {
                console.error(truncateErr);
                reject({ statusCode: 500, responseMessage: truncateErr });
                return;
            }
            resolve({ statusCode: 200, responseMessage: 'Categories truncated successfully.' });

            connection.end();
        });
    });
}

const addCategories = (categories) => {
    return new Promise((resolve, reject) => {
        const newCategories = categories.map(c => new Category(c));

        for (const newCategory of newCategories) {
            if (!objectIsValid(newCategories)) {
                reject({ status: 400, responseMessage: 'Invalid Body.' });
                return;
            }
        }
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        const values = newCategories.map(newCategory => [newCategory.name, newCategory.description, newCategory.image]);

        connection.query("INSERT INTO category(name, description, image) VALUES ?", [values], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            for (let i = 0; i < result.affectedRows; i++) {
                newCategories[i].id = result.insertId + i;
            }

            resolve({ statusCode: 200, responseMessage: newCategories });
            connection.end();
        });
    });
};

module.exports.getCategories = getCategories;
module.exports.getCategory = getCategory;
module.exports.addCategory = addCategory;
module.exports.editCategory = editCategory;
module.exports.deleteCategory = deleteCategory;
module.exports.truncateCategories = truncateCategories;
module.exports.addCategories = addCategories;
