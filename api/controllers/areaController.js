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
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Not authorized.');
    }

    handlePromise(areaActions.addArea(req.body), res);
};

const editArea = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Not authorized.');
    }

    const id = req.params.id;
    handlePromise(areaActions.editArea(id, req.body), res);
};

const deleteArea = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Not authorized.');
    }

    const id = req.params.id;
    handlePromise(areaActions.deleteArea(id), res);
};

const truncateAreas = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Not authorized.');
    }

    handlePromise(areaActions.truncateAreas(), res);
};

const addAreas = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Not authorized.');
    }
    
    handlePromise(areaActions.addAreas(req.body), res);
};

module.exports.readAreas = readAreas;
module.exports.readArea = readArea;
module.exports.addArea = addArea;
module.exports.editArea = editArea;
module.exports.deleteArea = deleteArea;
module.exports.truncateAreas = truncateAreas;
module.exports.addAreas = addAreas;