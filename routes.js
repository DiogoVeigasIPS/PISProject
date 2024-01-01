/**
 * Filename: index.js
 * Purpose: Manages the application's workflow.
 */
const express = require('express');
const { recipeActions } = require('./api/actions');

const router = express.Router();

router.use('/', async (req, res) => {
    const recipes = await recipeActions.getRecipes({ isRandom: true, max: 6 });

    res.render('index', { recipes: recipes.msg });
});

module.exports = router;
