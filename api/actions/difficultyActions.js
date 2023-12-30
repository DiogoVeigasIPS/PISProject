/**
 * Filename: difficultyActions.js
 * Purpose: Aggregates all actions for the Difficulty entity.
 */
const { Difficulty } = require('../models');
const { objectIsValid } = require('../utils');

const { difficulties } = require('../temporaryData');

const getDifficulties = () => {
    return new Promise((resolve, reject) => {
        resolve({ code: 200, msg: difficulties});
    });
}

const getDifficulty = (id) => {
    return new Promise((resolve, reject) => {
        const difficulty = difficulties.find(d => d.id == id)
        if (difficulty == null) {
            reject({ code: 404, msg: 'Difficulty not found.' });
        }
        resolve({ code: 201, msg: difficulty})
    });
}

const addDifficulty = (difficulty) => {
    return new Promise((resolve, reject) => {
        const id = (difficulties.length == 0) ? 1: difficulties.at(-1).id + 1;
        const newDifficulty = new Difficulty(difficulty, id);
        if (objectIsValid(newDifficulty)){
            difficulties.push(newDifficulty);
            resolve({ code: 201, msg: newDifficulty});
            return;
        }
        reject({ code: 400, msg: 'Invalid Body.' });
    })
}

const editDifficulty = (id, difficulty) => {
    return new Promise((resolve, reject) => {
        const newDifficulty = new Difficulty(difficulty, id);
        const oldDifficulty = difficulties.find(c => c.id == id);

        if (!objectIsValid(newDifficulty)) {
            reject({ code: 400, msg: 'Invalid body.' });
            return;
        }

        if (oldDifficulty == null) {
            reject({ code: 404, msg: 'Difficulty not found.' });
            return;
        }

        for (prop in newDifficulty) {
            oldDifficulty[prop] = newDifficulty[prop];
        }

        resolve({ code: 200, msg: oldDifficulty });
    })
}

const deleteDifficulty = (id) => {
    return new Promise((resolve, reject) => {
        const difficultyIndex = difficulties.findIndex(c => c.id == id);

        if (difficultyIndex == -1){
            reject({ code: 404, msg: 'Difficulty not found.'})
            return;
        }

        difficulties.splice(difficultyIndex, 1);

        resolve({ code: 200, msg: 'Difficulty deleted sucessfully.'});
    })
}

module.exports.getDifficulties = getDifficulties;
module.exports.getDifficulty = getDifficulty;
module.exports.addDifficulty = addDifficulty;
module.exports.editDifficulty = editDifficulty;
module.exports.deleteDifficulty = deleteDifficulty;