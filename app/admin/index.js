/**
 * Filename: index.js
 * Purpose: Manages the application's admin part workflow.
 */
const express = require('express');
const { recipeActions, ingredientActions } = require('../../api/actions');

const router = express.Router();

router.get('', async (req, res) => {
    const recipes = (await recipeActions.getRecipes()).responseMessage;
    res.render('backRecipes', { recipes: recipes, title: 'Recipes' });
});

router.get('/ingredients', async (req, res) => {
    const stringSearch = req.query.name || null;
    const order = req.query.sort || null;
    const by = req.query.by == 'asc' ? 'desc' : 'asc';
    const queryOptions = {
        stringSearch: stringSearch,
        order: order,
        by: by
    };

    const ingredients = (await ingredientActions.getIngredients(queryOptions)).responseMessage;

    res.render('backIngredients', { ingredients: ingredients, title: 'Ingredients'  });
});


router.get('/ingredient/details/:id', async (req, res) => {
    const id = req.params.id;
    const ingredient = (await ingredientActions.getIngredient(id)).responseMessage;

    res.render('backIngredientDetails', { ingredient: ingredient, title: ingredient.name + ' details'  });
});

module.exports = router;