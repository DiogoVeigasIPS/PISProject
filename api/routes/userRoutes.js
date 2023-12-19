/**
 * Filename: userRoutes.js
 * Purpose: Implements all routes of the user entity.
 */
const express = require('express');

const { userController } = require('../controllers');

const router = express.Router();

router.get('', userController.readUsers);
router.get('/:id', userController.readUser);
router.post('', userController.addUser);
router.put('/:id', userController.editUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;