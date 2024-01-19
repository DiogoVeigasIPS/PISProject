/**
 * Filename: index.js
 * Purpose: Manages the application's admin part workflow.
 */
const express = require('express');

const { recipeActions, ingredientActions } = require('../../api/actions');

const router = express.Router();

router.get('/recipes', async (req, res) => {
    const recipes = (await recipeActions.getRecipes()).responseMessage;
    res.render('backRecipes', { recipes: recipes, title: 'Recipes' });
});

router.get('/ingredients', async (req, res) => {
    const stringSearch = req.query.name || null;
    const orderBy = req.query.order ?? null;

    const queryOptions = {
        stringSearch: stringSearch,
        orderBy: orderBy,
        isPartial: true
    };

    const ingredients = (await ingredientActions.getIngredients(queryOptions)).responseMessage;

    res.render('backIngredients', { ingredients: ingredients, title: 'Ingredients' });
});


router.get('/ingredient/:id', async (req, res) => {
    const id = req.params.id;
    const ingredient = (await ingredientActions.getIngredient(id)).responseMessage;

    res.render('backIngredientDetails', { ingredient: ingredient, title: ingredient.name + ' details' });
});

module.exports = router;