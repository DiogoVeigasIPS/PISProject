/**
 * Filename: areaRoutes.js
 * Purpose: Implements all routes of the area entity.
 */
const express = require('express');

const { verifyJWT } = require('../jsonWebToken');
const { seedController } = require('../controllers');

const router = express.Router();

router.get('/categories', verifyJWT, seedController.seedCategories);
router.get('/areas', verifyJWT, seedController.seedAreas);
router.get('/ingredients', verifyJWT, seedController.seedIngredients);
router.get('/recipes', verifyJWT, seedController.seedRecipes);
router.get('/all', verifyJWT, seedController.seedAll);

module.exports = router;