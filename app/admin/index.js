/**
 * Filename: index.js
 * Purpose: Manages the application's admin part workflow.
 */
const express = require('express');
const session = require('express-session');
let dotenv = require('dotenv').config()

const { recipeActions, ingredientActions } = require('../../api/actions');
const { verifyJWT } = require('../../api/jsonWebToken');

const router = express.Router();

router.use(session({
    secret: dotenv.parsed.SECRET_WORD,
    resave: true,
    saveUninitialized: true
}));

router.get('/recipes', verifyJWT, async (req, res) => {
    const id = req.userId;
    const isAdmin = req.isAdmin;

    if (id == null || !isAdmin) {
        res.render('unauthorized');
        return;
    }

    const recipes = (await recipeActions.getRecipes()).responseMessage;
    res.render('backRecipes', { recipes: recipes, title: 'Recipes' });
});

router.get('/ingredients', verifyJWT, async (req, res) => {
    const id = req.userId;
    const isAdmin = req.isAdmin;

    if (id == null || !isAdmin) {
        res.render('unauthorized');
        return;
    }

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


router.get('/ingredient/details/:id', async (req, res) => {
    const id = req.params.id;
    const ingredient = (await ingredientActions.getIngredient(id)).responseMessage;

    res.render('backIngredientDetails', { ingredient: ingredient, title: ingredient.name + ' details' });
});

module.exports = router;