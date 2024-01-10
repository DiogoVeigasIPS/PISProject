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

        connection.query("SELECT * FROM area", (err, rows, fields) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            } 

            const areas = rows.map(r => new Area(r));

            resolve({ statusCode: 200, responseMessage: areas });
        });

        connection.end();
    });
}

const getArea = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM area WHERE id = ?", [id], (err, rows, fields) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 404, responseMessage: 'Area not found.' });
                return;
            } 

            const area = rows[0];

            resolve({ statusCode: 200, responseMessage: area });
        });

        connection.end();
    });
}

const addArea = (area) => {
    return new Promise((resolve, reject) => {
        const id = (areas.length == 0) ? 1 : areas.at(-1).id + 1;
        const newArea = new Area(area, id);
        if (objectIsValid(newArea)) {
            areas.push(newArea);
            resolve({ statusCode: 201, responseMessage: newArea });
            return;
        }
        reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
    })
}

const editArea = (id, area) => {
    return new Promise((resolve, reject) => {
        const newArea = new Area(area, id);
        const oldArea = areas.find(a => a.id == id);

        if (!objectIsValid(newArea)) {
            reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            return;
        }

        if (oldArea == null) {
            reject({ statusCode: 404, responseMessage: 'Area not found.' });
            return;
        }

        for (prop in newArea) {
            oldArea[prop] = newArea[prop];
        }

        resolve({ statusCode: 200, responseMessage: oldArea });
    })
}

const deleteArea = (id) => {
    return new Promise((resolve, reject) => {
        const areaIndex = areas.findIndex(a => a.id == id);

        if (areaIndex == -1) {
            reject({ statusCode: 404, responseMessage: 'Area not found.' })
            return;
        }

        areas.splice(areaIndex, 1);

        resolve({ statusCode: 200, responseMessage: 'Area deleted sucessfully.' });
    })
}

module.exports.getAreas = getAreas;
module.exports.getArea = getArea;
module.exports.addArea = addArea;
module.exports.editArea = editArea;
module.exports.deleteArea = deleteArea;