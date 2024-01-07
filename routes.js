/**
 * Filename: index.js
 * Purpose: Manages the application's workflow.
 */
const express = require('express');
const { recipeActions, areaActions, categoryActions, difficultyActions } = require('./api/actions');

const router = express.Router();

router.get('/add-recipe', async (req, res) => {

    const categories = await categoryActions.getCategories();
    const areas = await areaActions.getAreas();
    const difficulties = await difficultyActions.getDifficulties();

    const renderOptions = {
        title: "Adding a recipe",
        categories: categories.responseMessage, 
        areas: areas.responseMessage, 
        difficulties: difficulties.responseMessage
    }

    res.render('recipeForm', renderOptions);
});

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

// Auth Page
router.get('/auth', (req, res) => {
    res.render('auth', { title: "Auth" });
});

router.get('/categories', async (req, res) => {
    const categories = await categoryActions.getCategories();

    res.render('categories', { categories: categories.responseMessage, title: "Auth" });
});

// Home Page
router.get('/', async (req, res) => {
    const stringSearch = req.query.q ? req.query.q : null;
    const area = req.query.area ? req.query.area : null;
    const category = req.query.category ? req.query.category : null;

    const queryOptions = {
        maxResults: 8,
        isPartial: true,
        area: area,
        category: category
    };

    var recipes;
    if (stringSearch == null) {
        queryOptions.isRandom = true;
        //queryOptions.area = area;
        recipes = await recipeActions.getRecipes(queryOptions);
    } else {
        queryOptions.stringSearch = stringSearch
        recipes = await recipeActions.getRecipes(queryOptions);
    }

    const areas = await areaActions.getAreas();
    const filteresAreas = areas.responseMessage.filter(a => a.name != 'Unknown');

    const categoryQueryOptions = {
        isRandom: true,
        maxResults: 4
    };
    const categories = await categoryActions.getCategories(categoryQueryOptions);

    const renderOptions = {
        title: "My Cuisine Pal",
        recipes: recipes.responseMessage,
        areas: filteresAreas,
        categories: categories.responseMessage
    }

    if (recipes.responseMessage.length > 0) {
        res.render('index', renderOptions);
    } else {
        renderOptions.recipes = null;
        res.render('index', renderOptions);
    }

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
