/**
 * Filename: index.js
 * Purpose: Aggregates all routes.
 */
const express = require('express');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/api/user', userRoutes);

module.exports = router;
