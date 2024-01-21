/**
 * Filename: ingredientRoutes.js
 * Purpose: Implements all routes of the ingredient entity.
 */
const express = require('express');

const { verifyJWT } = require('../jsonWebToken');
const { ingredientController } = require('../controllers');

const router = express.Router();

router.get('', ingredientController.readIngredients);
router.get('/:id', ingredientController.readIngredient);
router.post('', verifyJWT, ingredientController.addIngredient);
router.put('/:id', verifyJWT, ingredientController.editIngredient);
router.delete('/:id', verifyJWT, ingredientController.deleteIngredient);
router.delete('', verifyJWT, ingredientController.truncateIngredients);
router.post('/bulk', verifyJWT, ingredientController.addIngredients);

module.exports = router;