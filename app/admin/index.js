/**
 * Filename: index.js
 * Purpose: Manages the application's admin part workflow.
 */
const express = require('express');

const { recipeActions, ingredientActions, categoryActions, difficultyActions, areaActions } = require('../../api/actions');

const router = express.Router();

router.get('/recipes', async (req, res) => {
    const stringSearch = req.query.name || null;
    const orderBy = req.query.order ?? null;

    const queryOptions = {
        orderBy: orderBy,
        isPartial: true,
        isNamed: true,
        stringSearch
    };
    
    const recipes = (await recipeActions.getRecipes(queryOptions)).responseMessage;

    const categories = await categoryActions.getCategories();
    const areas = await areaActions.getAreas();
    const difficulties = await difficultyActions.getDifficulties();

    const renderOptions = {
        categories: categories.responseMessage,
        areas: areas.responseMessage,
        difficulties: difficulties.responseMessage,
        recipes: recipes
    }

    res.render('backRecipes', renderOptions);
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

router.get('/recipe/:id', async (req, res) => {
    const id = req.params.id;
    const recipe = (await recipeActions.getRecipe(id)).responseMessage;
    const categories = await categoryActions.getCategories();
    const areas = await areaActions.getAreas();
    const difficulties = await difficultyActions.getDifficulties();

    res.render('backRecipeDetails', { recipe: recipe, categories: categories, areas: areas, difficulties: difficulties,
        title: recipe.name + 'details'});
});