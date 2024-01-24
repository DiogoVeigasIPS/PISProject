/**
 * Filename: index.js
 * Purpose: Manages the application's basic user workflow.
 */
const express = require('express');

const { recipeActions, areaActions, categoryActions } = require('../../api/actions');
const { Recipe } = require('../../api/models');
const { prepareRecipe } = require('../utils');

const router = express.Router();

router.get('/auth', (req, res) => {
    res.render('auth');
});

router.get('/me', async (req, res) => {
    res.render('userPage',);
});

// Details Page
router.get('/recipe/:id', async (req, res) => {
    const queryId = req.params.id;
    const id = queryId && !isNaN(queryId) ? parseInt(queryId) : null;

    if (id !== null) {
        try {
            var recipe = await recipeActions.getRecipe(id);
            const preparedRecipe = prepareRecipe(recipe.responseMessage);

            res.render('recipe', { recipe: preparedRecipe, title: `My Cuisine Pal - ${preparedRecipe.name}` });
        } catch (error) {
            console.error(error);
            res.render('notFound', { title: "Page Not Found" });
        }
    } else {
        res.render('notFound', { title: "Page Not Found" });
    }
});

router.get('/categories', async (req, res) => {
    const categories = await categoryActions.getCategories();

    res.render('categories', { categories: categories.responseMessage, title: "Categories" });
});

// Home Page
router.get('/', async (req, res) => {
    const stringSearch = req.query.q ? req.query.q : null;
    const area = req.query.area ? req.query.area : null;
    const category = req.query.category ? req.query.category : null;

    const queryOptions = {
        maxResults: 8,
        isPartial: true,
        area: parseInt(area),
        category: parseInt(category)
    };

    var recipes;
    if (stringSearch == null) {
        queryOptions.isRandom = true;
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
