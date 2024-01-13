/**
 * Filename: index.js
 * Purpose: Manages the application's admin part workflow.
 */
const express = require('express');
const { recipeActions, ingredientActions } = require('../../api/actions');

const router = express.Router();

router.get('', async (req, res) => {
    const recipes = (await recipeActions.getRecipes()).responseMessage;
    res.render('backRecipes', { recipes: recipes });
});

router.get('/ingredients', async (req, res) => {
    const ingredients = (await ingredientActions.getIngredients()).responseMessage;
    res.render('partials/ingredients', { ingredients: ingredients});
});


module.exports = router;