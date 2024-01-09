/**
 * Filename: areaActions.js
 * Purpose: Aggregates all actions for the Area entity.
 */
const { Area } = require('../models');
const { objectIsValid } = require('../utils');

const { areas } = require('../temporaryData');

const getAreas = () => {
    return new Promise((resolve, reject) => {
        resolve({ statusCode: 200, responseMessage: areas});
    });
}

const getArea = (id) => {
    return new Promise((resolve, reject) => {
        const area = areas.find(a => a.id == id)
        if (area == null) {
            reject({ statusCode: 404, responseMessage: 'Area not found.' });
            return;
        }
        resolve({ statusCode: 200, responseMessage: area})
    });
}

const addArea = (area) => {
    return new Promise((resolve, reject) => {
        const id = (areas.length == 0) ? 1: areas.at(-1).id + 1;
        const newArea = new Area(area, id);
        if (objectIsValid(newArea)){
            areas.push(newArea);
            resolve({ statusCode: 201, responseMessage: newArea});
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

        if (areaIndex == -1){
            reject({ statusCode: 404, responseMessage: 'Area not found.'})
            return;
        }

        areas.splice(areaIndex, 1);

        resolve({ statusCode: 200, responseMessage: 'Area deleted sucessfully.'});
    })
}

module.exports.getAreas = getAreas;
module.exports.getArea = getArea;
module.exports.addArea = addArea;
module.exports.editArea = editArea;
module.exports.deleteArea = deleteArea;