/**
 * Filename: recipeRoutes.js
 * Purpose: Implements all routes of the recipe entity.
 */
const express = require('express');

const { recipeController } = require('../controllers');

const router = express.Router();

router.get('', recipeController.readRecipes);
router.get('/:id', recipeController.readRecipe);
router.post('', recipeController.addRecipe);
router.put('/:id', recipeController.editRecipe);
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;