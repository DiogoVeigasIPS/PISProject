/**
 * Filename: index.js
 * Purpose: Manages the application's workflow.
 */
const express = require('express');
const { recipeActions } = require('./api/actions');

const router = express.Router();

// Details Page
router.get('/recipe', async (req, res) => {
    const queryId = req.query.id;
    const id = queryId && !isNaN(queryId) ? parseInt(queryId) : null;

    if (id !== null) {
        try {
            var recipe = await recipeActions.getRecipe(id);

            res.render('recipe', { recipe: prepareRecipe(recipe.responseMessage), title: "My Cuisine Pal" });
        } catch (error) {
            console.error(error);
            res.render('notFound', { title: "Page Not Found" });
        }
    } else {
        res.render('notFound', { title: "Page Not Found" });
    }
});

// Home Page
router.get('/', async (req, res) => {
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

    res.render('index', { recipes: recipes.responseMessage, title: "My Cuisine Pal" });
});

// Auth Page
router.get('/auth', async (req, res) => {
    res.render('auth', { title: "Auth" });
});

router.get('*', (req, res) => {
    res.status(404).render('notFound', { title: 'Page Not Found' });
});

module.exports = router;

/**
 * [prepareRecipe] - Receives a recipe from our API and returns it without null values, but default values.
 *
 * @param {Recipe} recipe - Recipe from the API.
 * @returns {Recipe} - The processed recipe with no null values.
 */
const prepareRecipe = (recipe) => {
    const defaultValue = "Not provided";
    
    if (recipe.author == null) {
        recipe.author = { username: defaultValue }
    }
    if (recipe.difficulty == null) {
        recipe.difficulty = { name: defaultValue }
    }

    for (const prop in recipe) {
        if (recipe[prop] == null) {
            recipe[prop] = defaultValue;
        }
    }
    return recipe;
}
