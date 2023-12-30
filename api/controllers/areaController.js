/**
 * Filename: areaController.js
 * Purpose: Aggregates all controllers for the Area entity.
 */

const { areaActions } = require('../actions');
const { handlePromise } = require('../utils');

const readAreas = (req, res) => {
    handlePromise(areaActions.getAreas(), res);
};

const readArea = (req, res) => {
    const id = req.params.id;
    handlePromise(areaActions.getArea(id), res);
};

const addArea = (req, res) => {
    handlePromise(areaActions.addArea(req.body), res);
};

const editArea = (req, res) => {
    const id = req.params.id;
    handlePromise(areaActions.editArea(id, req.body), res);
};

const deleteArea = (req, res) => {
    const id = req.params.id;
    handlePromise(areaActions.deleteArea(id), res);
};

module.exports.readAreas = readAreas;
module.exports.readArea = readArea;
module.exports.addArea = addArea;
module.exports.editArea = editArea;
module.exports.deleteArea = deleteArea;