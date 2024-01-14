/**
 * Filename: userRoutes.js
 * Purpose: Implements all routes of the user entity.
 */
const express = require('express');

const { userController } = require('../controllers');

const router = express.Router();

router.get('/auth', userController.isLoggedIn);
router.get('', userController.readUsers);
router.get('/:id', userController.readUser);
router.post('', userController.addUser);
router.put('/:id', userController.editUser);
router.delete('/:id', userController.deleteUser);
router.post('/login', userController.loginUser);
router.post('/signup', userController.signupUser);

module.exports = router;