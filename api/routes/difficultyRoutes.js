/**
 * Filename: difficultyRoutes.js
 * Purpose: Implements all routes of the Difficulty entity.
 */
const express = require('express');

const { verifyJWT } = require('../jsonWebToken');
const { difficultyController } = require('../controllers');

const router = express.Router();

router.get('', difficultyController.readDifficulties);
router.get('/:id', difficultyController.readDifficulty);
router.post('', verifyJWT, difficultyController.addDifficulty);
router.put('/:id', verifyJWT, difficultyController.editDifficulty);
router.delete('/:id', verifyJWT, difficultyController.deleteDifficulty);

module.exports = router;