/**
 * Filename: areaRoutes.js
 * Purpose: Implements all routes of the area entity.
 */
const express = require('express');

const { seedController } = require('../controllers');

const router = express.Router();

router.get('/categories', seedController.seedCategories);
router.get('/areas', seedController.seedAreas);
router.get('/ingredients', seedController.seedIngredients);
router.get('/recipes', seedController.seedRecipes);
router.get('/all', seedController.seedAll);

module.exports = router;