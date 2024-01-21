/**
 * Filename: userRoutes.js
 * Purpose: Implements all routes of the user entity.
 */
const express = require('express');

const { userController } = require('../controllers');
const { verifyJWT } = require('../jsonWebToken');

const router = express.Router();

router.get('/:id/favoriteRecipe', userController.getFavorites);
router.post('/:id/favoriteRecipe/:recipe_id', userController.addFavorite);
router.delete('/:id/favoriteRecipe/:recipe_id', userController.removeFavorite);
router.get('/loggedIn', verifyJWT, userController.userIsLoggedIn);

router.get('', userController.readUsers);
router.get('/:id', userController.readUser);
router.post('', userController.addUser);
router.put('/:id', userController.editUser);
router.delete('/:id', verifyJWT, userController.deleteUser);
router.post('/login', userController.loginUser);
router.post('/signup', userController.signupUser);

module.exports = router;