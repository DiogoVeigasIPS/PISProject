/**
 * Filename: index.js
 * Purpose: Manages the application's basic user workflow.
 */
const express = require('express');

const { recipeActions, areaActions, categoryActions, difficultyActions, userActions } = require('../../api/actions');
const { IngredientInRecipe, Ingredient, Category, Area, Difficulty, Recipe, Author } = require('../../api/models');

const router = express.Router();

router.get('/auth', (req, res) => {
    res.render('auth');
});

router.get('/me', async (req, res) => {
    res.render('userPage',);
});

router.post('/submit-recipe', async (req, res) => {
    const body = req.body;

    const ingredients = [];

    // Add the ids and quantities
    for (let i = 0; i < body.quantities.length; i++) {
        ingredients.push(new IngredientInRecipe({
            ingredient: new Ingredient({ id: body.ingredientIds[i] }),
            quantity: body.quantities[i]
        }))
    }

    const recipe = new Recipe({
        id: null,
        name: body.name,
        category: new Category({ id: body.category, name: null, description: null, image: null }),
        description: body.description,
        preparationDescription: body.preparationDescription,
        area: new Area({ id: body.area, name: null }),
        author: new Author({ id: null, username: null, firstName: null, lastName: null }),
        image: body.image,
        preparationTime: body.preparationTime,
        difficulty: new Difficulty({ id: body.difficulty, name: null }),
        cost: body.cost,
        ingredients: ingredients
    });

    try {
        const newRecipe = await recipeActions.addRecipe(recipe);
        res.redirect(`/recipe?id=${newRecipe.responseMessage.id}`);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }

    //res.json(body);
});

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

    if (recipe.author?.username == null) {
        recipe.author = { username: defaultValue }
    }
    if (recipe.difficulty?.name == null) {
        recipe.difficulty = { name: defaultValue }
    }

    for (const prop in recipe) {
        if (recipe[prop] == null) {
            recipe[prop] = defaultValue;
        }
    }
    return recipe;
}
