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
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            if (result.length == 0) {
                reject({ statusCode: 404, responseMessage: 'Area not found.' });
                return;
            }

            const area = new Area(result[0]);

            resolve({ statusCode: 200, responseMessage: area });
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
                reject({ statusCode: 400, responseMessage: err });
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
                reject({ statusCode: 400, responseMessage: err });
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
                reject({ statusCode: 400, responseMessage: err });
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

const truncateAreas = () => {
    return new Promise((resolve, reject) => {
        const multipleStatementsOptions = { ...connectionOptions };
        multipleStatementsOptions.multipleStatements = true;

        const connection = mysql.createConnection(multipleStatementsOptions);
        connection.connect();

        const queryString = "SET FOREIGN_KEY_CHECKS = 0; TRUNCATE TABLE area; SET FOREIGN_KEY_CHECKS = 1;";

        connection.query(queryString, (truncateErr, truncateResult) => {
            if (truncateErr) {
                console.error(truncateErr);
                reject({ statusCode: 500, responseMessage: truncateErr });
                return;
            }

            resolve({ statusCode: 200, responseMessage: 'Areas truncated successfully.' });

            connection.end();
        });
    });
};

const addAreas = (areas) => {
    return new Promise((resolve, reject) => {
        const newAreas = areas.map(a => new Area(a));

        for (const newArea of newAreas) {
            if (!objectIsValid(newArea)) {
                reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
                return;
            }
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        // Create an array of values for bulk insert
        const values = newAreas.map(newArea => [newArea.name]);

        connection.query("INSERT INTO area (name) VALUES ?", [values], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            // Update the IDs for the newly inserted areas
            for (let i = 0; i < result.affectedRows; i++) {
                newAreas[i].id = result.insertId + i;
            }

            resolve({ statusCode: 200, responseMessage: newAreas });
            connection.end();
        });
    });
};


module.exports.getAreas = getAreas;
module.exports.getArea = getArea;
module.exports.addArea = addArea;
module.exports.editArea = editArea;
module.exports.deleteArea = deleteArea;
module.exports.truncateAreas = truncateAreas;
module.exports.addAreas = addAreas;