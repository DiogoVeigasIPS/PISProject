/**
 * Filename: ingredientController.js
 * Purpose: Aggregates all controllers for the Ingredient entity.
 */
const { ingredientActions } = require('../actions');
const { handlePromise } = require('../utils');

const readIngredients = (req, res) => {
    const query = req.query;
    const stringSearch = query.name ? query.name : null;
    const maxResults = query.max && !isNaN(query.max) ? parseInt(query.max) : null;
    const isRandom = query.random && query.random.toLowerCase() === 'true';
    const orderBy = query.order ?? null;
    const isPartial = query.partial && query.partial.toLowerCase() === 'true';

    const queryOptions = {
        stringSearch: stringSearch,
        maxResults: maxResults,
        isRandom: isRandom,
        orderBy: orderBy,
        isPartial: isPartial
    }

    handlePromise(ingredientActions.getIngredients(queryOptions), res);
};

const readIngredient = (req, res) => {
    const id = req.params.id;
    handlePromise(ingredientActions.getIngredient(id), res);
};

const addIngredient = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }

    handlePromise(ingredientActions.addIngredient(req.body), res);
};

const editIngredient = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }

    const id = req.params.id;
    handlePromise(ingredientActions.editIngredient(id, req.body), res);
};

const deleteIngredient = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }

    const id = req.params.id;
    handlePromise(ingredientActions.deleteIngredient(id), res);
};

const truncateIngredients = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }

    handlePromise(ingredientActions.truncateIngredients(), res);
};

const addIngredients = (req, res) => {
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
        return res.status(403).send('Forbidden.');
    }
    
    handlePromise(ingredientActions.addIngredients(req.body), res);
};

module.exports.readIngredients = readIngredients;
module.exports.readIngredient = readIngredient;
module.exports.addIngredient = addIngredient;
module.exports.editIngredient = editIngredient;
module.exports.deleteIngredient = deleteIngredient;
module.exports.truncateIngredients = truncateIngredients;
module.exports.addIngredients = addIngredients;