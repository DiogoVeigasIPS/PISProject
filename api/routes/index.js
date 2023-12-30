/**
 * Filename: index.js
 * Purpose: Aggregates all routes.
 */
const express = require('express');
const userRoutes = require('./userRoutes');
const areaRoutes = require('./areaRoutes');
const categoryRoutes = require('./categoryRoutes');
const difficultyRoutes = require('./difficultyRoutes');

const router = express.Router();

router.use('/user', userRoutes);

router.use('/area', areaRoutes);

router.use('/category', categoryRoutes);

router.use('/difficulty', difficultyRoutes);


module.exports = router;
