/**
 * Filename: index.js
 * Purpose: Manages the application's workflow.
 */
const express = require('express');
const router = express.Router();

const appRoutes = require('./user');
const adminRoutes = require('./admin');

router.use(appRoutes);
router.use('/admin', adminRoutes);

module.exports = router;