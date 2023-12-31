/**
 * Filename: areaRoutes.js
 * Purpose: Implements all routes of the area entity.
 */
const express = require('express');

const { seedController } = require('../controllers');

const router = express.Router();

router.get('/categories', seedController.seedCategories);

module.exports = router;