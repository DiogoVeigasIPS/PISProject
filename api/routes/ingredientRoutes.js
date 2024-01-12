/**
 * Filename: ingredientRoutes.js
 * Purpose: Implements all routes of the ingredient entity.
 */
const express = require('express');

const { ingredientController } = require('../controllers');

const router = express.Router();

router.get('', ingredientController.readIngredients);
router.get('/:id', ingredientController.readIngredient);
router.post('', ingredientController.addIngredient);
router.put('/:id', ingredientController.editIngredient);
router.delete('/:id', ingredientController.deleteIngredient);
router.delete('', ingredientController.truncateIngredients);
router.post('/bulk', ingredientController.addIngredients);

module.exports = router;