/**
 * Filename: categoryController.js
 * Purpose: Aggregates all controllers for the Category entity.
 */
const { categoryActions, areaActions } = require('../actions');
const { handlePromise } = require('../utils');

const readCategories = (req, res) => {
    const query = req.query;

    const maxResults = query.max && !isNaN(query.max) ? parseInt(query.max) : null;
    const isRandom = query.random && query.random.toLowerCase() === 'true';

    const queryOptions = {
        maxResults: maxResults,
        isRandom: isRandom
    }

    handlePromise(categoryActions.getCategories(queryOptions), res);
};

const readCategory = (req, res) => {
    const id = req.params.id;
    handlePromise(categoryActions.getCategory(id), res);
};

const addCategory = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }

    handlePromise(categoryActions.addCategory(req.body), res);
};

const editCategory = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }

    const id = req.params.id;
    handlePromise(categoryActions.editCategory(id, req.body), res);
};

const deleteCategory = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }

    const id = req.params.id;
    handlePromise(categoryActions.deleteCategory(id), res);
};

const truncateCategories = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }

    handlePromise(categoryActions.truncateCategories(), res);
};

const addCategories = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }
    
    handlePromise(categoryActions.addCategories(req.body), res);
};

module.exports.readCategories = readCategories;
module.exports.readCategory = readCategory;
module.exports.addCategory = addCategory;
module.exports.editCategory = editCategory;
module.exports.deleteCategory = deleteCategory;
module.exports.truncateCategories = truncateCategories;
module.exports.addCategories = addCategories;