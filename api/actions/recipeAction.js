/**
 * Filename: areaActions.js
 * Purpose: Aggregates all actions for the Recipe entity.
 */
const { Recipe } = require('../models');
const { objectIsValid } = require('../utils');

const { recipe } = require('../temporaryData');

// TODO (methods need change)

const getRecipes = () => {
    return new Promise((resolve, reject) => {
        resolve({ code: 200, msg: areas});
    });
}

const getRecipe = (id) => {
    return new Promise((resolve, reject) => {
        const area = areas.find(a => a.id == id)
        if (area == null) {
            reject({ code: 404, msg: 'Area not found.' });
        }
        resolve({ code: 201, msg: area})
    });
}

const addRecipe = (area) => {
    return new Promise((resolve, reject) => {
        const id = (areas.length == 0) ? 1: areas.at(-1).id + 1;
        const newArea = new Area(area, id);
        if (objectIsValid(newArea)){
            areas.push(newArea);
            resolve({ code: 201, msg: newArea});
            return;
        }
        reject({ code: 400, msg: 'Invalid Body.' });
    })
}

const editRecipe = (id, area) => {
    return new Promise((resolve, reject) => {
        const newArea = new Area(area, id);
        const oldArea = areas.find(a => a.id == id);

        if (!objectIsValid(newArea)) {
            reject({ code: 400, msg: 'Invalid body.' });
            return;
        }

        if (oldArea == null) {
            reject({ code: 404, msg: 'Area not found.' });
            return;
        }

        for (prop in newArea) {
            oldArea[prop] = newArea[prop];
        }

        resolve({ code: 200, msg: oldArea });
    })
}

const deleteRecipe = (id) => {
    return new Promise((resolve, reject) => {
        const areaIndex = areas.findIndex(a => a.id == id);

        if (areaIndex == -1){
            reject({ code: 404, msg: 'Area not found.'})
            return;
        }

        areas.splice(areaIndex, 1);

        resolve({ code: 200, msg: 'Area deleted sucessfully.'});
    })
}

module.exports.getRecipes = getRecipes;
module.exports.getRecipe = getRecipe;
module.exports.addRecipe = addRecipe;
module.exports.editRecipe = editRecipe;
module.exports.deleteRecipe = deleteRecipe;