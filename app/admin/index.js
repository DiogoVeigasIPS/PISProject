/**
 * Filename: index.js
 * Purpose: Manages the application's admin part workflow.
 */
const express = require('express');
const { recipeActions } = require('../../api/actions');

const router = express.Router();

router.get('', async (req, res) => {
    const recipes = (await recipeActions.getRecipes()).responseMessage;
    res.render('backRecipes', { recipes: recipes });
});

module.exports = router;