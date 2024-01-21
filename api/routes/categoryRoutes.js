/**
 * Filename: categoryRoutes.js
 * Purpose: Implements all routes of the Category entity.
 */
const express = require('express');

const { verifyJWT } = require('../jsonWebToken');
const { categoryController } = require('../controllers');

const router = express.Router();

router.get('', categoryController.readCategories);
router.get('/:id', categoryController.readCategory);
router.post('', verifyJWT, categoryController.addCategory);
router.put('/:id', verifyJWT, categoryController.editCategory);
router.delete('/:id', verifyJWT, categoryController.deleteCategory);
router.delete('', verifyJWT, categoryController.truncateCategories);
router.post('/bulk', verifyJWT, categoryController.addCategories);

module.exports = router;