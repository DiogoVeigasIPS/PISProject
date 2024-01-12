/**
 * Filename: index.js
 * Purpose: Manages the application's admin part workflow.
 */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    const recipes = [
        { name: "Peitinho", custo: 55 },
        { name: "Arroz", custo: 22 }
    ]

    res.render('backRecipes', {recipes: recipes});
})

module.exports = router;