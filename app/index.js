/**
 * Filename: index.js
 * Purpose: Manages the application's workflow.
 */
const express = require('express');
const router = express.Router();

const appRoutes = require('./user');
const adminRoutes = require('./admin');

router.get('/unauthorized', (req, res) => {
    res.status(401).render('unauthorized');
})

router.use('/admin', adminRoutes);
router.use(appRoutes);


module.exports = router;