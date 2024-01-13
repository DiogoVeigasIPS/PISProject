/**
 * Filename: categoryRoutes.js
 * Purpose: Implements all routes of the Category entity.
 */
const express = require('express');

const { categoryController } = require('../controllers');

const router = express.Router();

router.get('', categoryController.readCategories);
router.get('/:id', categoryController.readCategory);
router.post('', categoryController.addCategory);
router.put('/:id', categoryController.editCategory);
router.delete('/:id', categoryController.deleteCategory);
router.delete('', categoryController.truncateCategories);
router.post('/bulk', categoryController.addCategories);

module.exports = router;