/**
 * Filename: difficultyRoutes.js
 * Purpose: Implements all routes of the Difficulty entity.
 */
const express = require('express');

const { difficultyController } = require('../controllers');

const router = express.Router();

router.get('', difficultyController.readDifficulties);
router.get('/:id', difficultyController.readDifficulty);
router.post('', difficultyController.addDifficulty);
router.put('/:id', difficultyController.editDifficulty);
router.delete('/:id', difficultyController.deleteDifficulty);

module.exports = router;