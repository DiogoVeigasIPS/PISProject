/**
 * Filename: index.js
 * Purpose: Aggregates all routes.
 */
const express = require('express');
const userRoutes = require('./userRoutes');
const areaRoutes = require('./areaRoutes');

const router = express.Router();

router.use('/user', userRoutes);

router.use('/area', areaRoutes);

module.exports = router;
