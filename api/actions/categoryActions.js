/**
 * Filename: categoryActions.js
 * Purpose: Aggregates all actions for the Category entity.
 */
const { Category } = require('../models');
const { objectIsValid } = require('../utils');

const { categories } = require('../temporaryData');

const getCategories = () => {
    return new Promise((resolve, reject) => {
        resolve({ statusCode: 200, responseMessage: categories});
    });
}

const getCategory = (id) => {
    return new Promise((resolve, reject) => {
        const category = categories.find(c => c.id == id)
        if (category == null) {
            reject({ statusCode: 404, responseMessage: 'Category not found.' });
        }
        resolve({ statusCode: 201, responseMessage: category})
    });
}

const addCategory = (category) => {
    return new Promise((resolve, reject) => {
        const id = (categories.length == 0) ? 1: categories.at(-1).id + 1;
        const newCategory = new Category(category, id);
        if (objectIsValid(newCategory)){
            categories.push(newCategory);
            resolve({ statusCode: 201, responseMessage: newCategory});
            return;
        }
        reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
    })
}

const editCategory = (id, category) => {
    return new Promise((resolve, reject) => {
        const newCategory = new Category(category, id);
        const oldCategory = categories.find(c => c.id == id);

        if (!objectIsValid(newCategory)) {
            reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            return;
        }

        if (oldCategory == null) {
            reject({ statusCode: 404, responseMessage: 'Category not found.' });
            return;
        }

        for (prop in newCategory) {
            oldCategory[prop] = newCategory[prop];
        }

        resolve({ statusCode: 200, responseMessage: oldCategory });
    })
}

const deleteCategory = (id) => {
    return new Promise((resolve, reject) => {
        const categoryIndex = categories.findIndex(c => c.id == id);

        if (categoryIndex == -1){
            reject({ statusCode: 404, responseMessage: 'Category not found.'})
            return;
        }

        categories.splice(categoryIndex, 1);

        resolve({ statusCode: 200, responseMessage: 'Category deleted sucessfully.'});
    })
}

module.exports.getCategories = getCategories;
module.exports.getCategory = getCategory;
module.exports.addCategory = addCategory;
module.exports.editCategory = editCategory;
module.exports.deleteCategory = deleteCategory;