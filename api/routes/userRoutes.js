/**
 * Filename: userRoutes.js
 * Purpose: Implements all routes of the user entity.
 */
const express = require('express');

const { userController } = require('../controllers');
const { verifyJWT } = require('../jsonWebToken');

const router = express.Router();

router.get('/:id/favoriteRecipe', verifyJWT, userController.getFavorites);
router.post('/:id/favoriteRecipe/:recipe_id', verifyJWT, userController.addFavorite);
router.delete('/:id/favoriteRecipe/:recipe_id', verifyJWT, userController.removeFavorite);
router.get('/loggedIn', verifyJWT, userController.userIsLoggedIn);

router.get('', verifyJWT, userController.readUsers);
router.get('/:id', verifyJWT, userController.readUser);
router.post('', verifyJWT, userController.addUser);
router.put('/:id', verifyJWT, userController.editUser);
router.delete('/:id', verifyJWT, userController.deleteUser);
router.post('/login', userController.loginUser);
router.post('/signup', userController.signupUser);

module.exports = router;