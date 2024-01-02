/**
 * Filename: index.js
 * Purpose: Manages the application's workflow.
 */
const express = require('express');
const { recipeActions } = require('./api/actions');

const router = express.Router();

router.use('/', async (req, res) => {
    const stringSearch = req.query.q ? req.query.q : null;

    const queryOptions = { maxResults: 8, isPartial: true };

    var recipes;
    if (stringSearch == null) {
        queryOptions.isRandom = true;
        recipes = await recipeActions.getRecipes(queryOptions);
    } else {
        queryOptions.stringSearch = stringSearch
        recipes = await recipeActions.getRecipes(queryOptions);
    }

    res.render('index', { recipes: recipes.responseMessage });
});

module.exports = router;
