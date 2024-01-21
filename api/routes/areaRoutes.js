/**
 * Filename: areaRoutes.js
 * Purpose: Implements all routes of the area entity.
 */
const express = require('express');

const { verifyJWT } = require('../jsonWebToken');
const { areaController } = require('../controllers');

const router = express.Router();

router.get('', areaController.readAreas);
router.get('/:id', areaController.readArea);
router.post('', verifyJWT, areaController.addArea);
router.put('/:id', verifyJWT, areaController.editArea);
router.delete('/:id', verifyJWT, areaController.deleteArea);
router.delete('', verifyJWT, areaController.truncateAreas);
router.post('/bulk', verifyJWT, areaController.addAreas);

module.exports = router;