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
    const stringSearch = req.query.name || null;
    const order = req.query.sort || null;
    const by = req.query.by == 'asc' ? 'desc' : 'asc';
    const queryOptions = {
        stringSearch: stringSearch,
        order: order,
        by: by
    };

    const ingredients = (await ingredientActions.getIngredients(queryOptions)).responseMessage;

    res.render('backIngredients', { ingredients: ingredients });
});


router.get('/ingredient/details/:id', async (req, res) => {
    const id = req.params.id;
    const ingredient = (await ingredientActions.getIngredient(id)).responseMessage;

    res.render('backIngredientDetails', { ingredient: ingredient });
});

router.get('/ingredient/edit/:id', async (req, res) => {
    const id = req.params.id;
    const ingredient = (await ingredientActions.getIngredient(id)).responseMessage;

    res.render('backIngredientCreateDelete', { ingredient: ingredient });
});

router.get('/ingredient/create/:id', async (req, res) => {
    const id = req.params.id;
    const ingredient = (await ingredientActions.getIngredient(id)).responseMessage;

    res.render('backIngredientCreateDelete', { ingredient: ingredient });
});

// In your admin.js or wherever you define your routes
router.delete('/ingredients/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await ingredientActions.deleteIngredient(id).responseMessage;;
        res.sendStatus(204); // Successfully deleted
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete ingredient.' });
    }

});


module.exports = router;