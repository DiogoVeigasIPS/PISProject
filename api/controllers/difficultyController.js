/**
 * Filename: difficultyConroller.js
 * Purpose: Aggregates all controllers for the Difficulty entity.
 */
const { difficultyActions } = require('../actions');
const { handlePromise } = require('../utils');

const readDifficulties = (req, res) => {
    handlePromise(difficultyActions.getDifficulties(), res);
};

const readDifficulty = (req, res) => {
    const id = req.params.id;
    handlePromise(difficultyActions.getDifficulty(id), res);
};

const addDifficulty = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }

    handlePromise(difficultyActions.addDifficulty(req.body), res);
};

const editDifficulty = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }

    const id = req.params.id;
    handlePromise(difficultyActions.editDifficulty(id, req.body), res);
};

const deleteDifficulty = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }
    
    const id = req.params.id;
    handlePromise(difficultyActions.deleteDifficulty(id), res);
};

module.exports.readDifficulties = readDifficulties;
module.exports.readDifficulty = readDifficulty;
module.exports.addDifficulty = addDifficulty;
module.exports.editDifficulty = editDifficulty;
module.exports.deleteDifficulty = deleteDifficulty;