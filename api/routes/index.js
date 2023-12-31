/**
 * Filename: index.js
 * Purpose: Aggregates all routes.
 */
const express = require('express');
const userRoutes = require('./userRoutes');
const areaRoutes = require('./areaRoutes');
const categoryRoutes = require('./categoryRoutes');
const difficultyRoutes = require('./difficultyRoutes');
const ingredientRoutes = require('./ingredientRoutes');
const recipeRoutes = require('./recipeRoutes');
const seedRoutes = require('./seedRoutes');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/area', areaRoutes);
router.use('/category', categoryRoutes);
router.use('/difficulty', difficultyRoutes);
router.use('/ingredient', ingredientRoutes);
router.use('/recipe', recipeRoutes);
router.use('/seed', seedRoutes);


module.exports = router;
