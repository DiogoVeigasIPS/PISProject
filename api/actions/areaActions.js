/**
 * Filename: areaActions.js
 * Purpose: Aggregates all actions for the Area entity.
 */
const mysql = require('mysql2');
const connectionOptions = require('./connectionOptions.json');

const { Area } = require('../models');
const { objectIsValid } = require('../utils');

const getAreas = () => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM area ORDER BY id", (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            const areas = result.map(r => new Area(r));

            resolve({ statusCode: 200, responseMessage: areas });
        });

        connection.end();
    });
}

const getArea = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM area WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 404, responseMessage: err });
                return;
            }

            if (result.length == 0) {
                reject({ statusCode: 404, responseMessage: 'Area not found.' });
                return;
            }

            resolve({ statusCode: 200, responseMessage: result[0] });
        });

        connection.end();
    });
}

const addArea = (area) => {
    return new Promise((resolve, reject) => {
        const newArea = new Area(area);

        if (!objectIsValid(newArea)) {
            reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("INSERT INTO area (name) VALUES (?)", [newArea.name], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 404, responseMessage: err });
                return;
            }

            newArea.id = result.insertId;
            resolve({ statusCode: 200, responseMessage: newArea });
        });

        connection.end();
    });
}

const editArea = (id, area) => {
    return new Promise((resolve, reject) => {
        const newArea = new Area(area);

        if (!objectIsValid(newArea)) {
            reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("UPDATE area SET name = ? WHERE id = ?", [newArea.name, id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 404, responseMessage: err });
                return;
            }

            if (result.affectedRows > 0) {
                const editedArea = { id, name: newArea.name };
                resolve({ statusCode: 200, responseMessage: editedArea });
            } else {
                reject({ statusCode: 404, responseMessage: 'Area not found.' });
            }
        });

        connection.end();
    });
}

const deleteArea = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("DELETE FROM area WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 404, responseMessage: err });
                return;
            }

            if (result.affectedRows > 0) {
                resolve({ statusCode: 200, responseMessage: 'Area deleted sucessfully.' });
            } else {
                reject({ statusCode: 404, responseMessage: 'Area not found.' });
            }
        });

        connection.end();
    });
}

module.exports.getAreas = getAreas;
module.exports.getArea = getArea;
module.exports.addArea = addArea;
module.exports.editArea = editArea;
module.exports.deleteArea = deleteArea;