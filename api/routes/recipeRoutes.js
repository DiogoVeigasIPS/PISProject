/**
 * Filename: recipeRoutes.js
 * Purpose: Implements all routes of the recipe entity.
 */
const express = require('express');

const { recipeController } = require('../controllers');

const router = express.Router();

router.post('/:id/addIngredient/:ingredient_id', recipeController.addIngredientToRecipe);
router.put('/:id/updateQuantity/:ingredient_id', recipeController.editIngredientQuantityInRecipe);
router.delete('/:id/removeIngredient/:ingredient_id', recipeController.removeIngredientFromRecipe);

router.get('', recipeController.readRecipes);
router.get('/:id', recipeController.readRecipe);
router.post('', recipeController.addRecipe);
router.put('/:id', recipeController.editRecipe);
router.delete('/:id', recipeController.deleteRecipe);

router.post('/bulk', recipeController.addRecipes);
router.delete('', recipeController.truncateRecipes);

module.exports = router;