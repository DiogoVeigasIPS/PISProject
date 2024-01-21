/**
 * Filename: recipeRoutes.js
 * Purpose: Implements all routes of the recipe entity.
 */
const express = require('express');

const { verifyJWT } = require('../jsonWebToken');
const { recipeController } = require('../controllers');

const router = express.Router();

router.post('/:id/setIngredients', recipeController.setRecipeIngredients);

router.post('/:id/addIngredient/:ingredient_id', recipeController.addIngredientToRecipe);
router.put('/:id/updateQuantity/:ingredient_id', recipeController.editIngredientQuantityInRecipe);
router.delete('/:id/removeIngredient/:ingredient_id', recipeController.removeIngredientFromRecipe);

router.get('', recipeController.readRecipes);
router.get('/:id', recipeController.readRecipe);
router.post('', verifyJWT, recipeController.addRecipe);
router.put('/:id', verifyJWT, recipeController.editRecipe);
router.delete('/:id', verifyJWT, recipeController.deleteRecipe);

router.post('/bulk', recipeController.addRecipes);
router.delete('', recipeController.truncateRecipes);

module.exports = router;