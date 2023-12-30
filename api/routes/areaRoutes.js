/**
 * Filename: areaRoutes.js
 * Purpose: Implements all routes of the area entity.
 */
const express = require('express');

const { areaController } = require('../controllers');

const router = express.Router();

router.get('', areaController.readAreas);
router.get('/:id', areaController.readArea);
router.post('', areaController.addArea);
router.put('/:id', areaController.editArea);
router.delete('/:id', areaController.deleteArea);

module.exports = router;