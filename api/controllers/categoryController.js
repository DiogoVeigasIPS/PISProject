/**
 * Filename: categoryController.js
 * Purpose: Aggregates all controllers for the Category entity.
 */
const { categoryActions } = require('../actions');
const { handlePromise } = require('../utils');

const readCategories = (req, res) => {
    handlePromise(categoryActions.getCategories(), res);
};

const readCategory = (req, res) => {
    const id = req.params.id;
    handlePromise(categoryActions.getCategory(id), res);
};

const addCategory = (req, res) => {
    handlePromise(categoryActions.addCategory(req.body), res);
};

const editCategory = (req, res) => {
    const id = req.params.id;
    handlePromise(categoryActions.editCategory(id, req.body), res);
};

const deleteCategory = (req, res) => {
    const id = req.params.id;
    handlePromise(categoryActions.deleteCategory(id), res);
};

module.exports.readCategories = readCategories;
module.exports.readCategory = readCategory;
module.exports.addCategory = addCategory;
module.exports.editCategory = editCategory;
module.exports.deleteCategory = deleteCategory;