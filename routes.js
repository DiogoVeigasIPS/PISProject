/**
 * Filename: index.js
 * Purpose: Manages the application's workflow.
 */
const express = require('express');
const { recipeActions } = require('./api/actions');

const router = express.Router();

router.use('/', async (req, res) => {
    const stringSearch = req.query.q ? req.query.q : null;

    var recipes;
    if(stringSearch == null){
        recipes = await recipeActions.getRecipes({ isRandom: true, maxResults: 8 });
    }else{
        recipes = await recipeActions.getRecipes({ isRandom: true, maxResults: 8, stringSearch: stringSearch });
    }

    res.render('index', { recipes: recipes.msg });
});

module.exports = router;
