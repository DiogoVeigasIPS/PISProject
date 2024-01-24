/**
 * Filename: userRoutes.js
 * Purpose: Implements all routes of the user entity.
 */
const express = require('express');

const { userController } = require('../controllers');
const { verifyJWT } = require('../jsonWebToken');

const router = express.Router();

router.get('/:id/recipeList', verifyJWT, userController.getRecipeLists);
router.post('/:id/recipeList', verifyJWT, userController.createRecipeList);
router.patch('/:id/recipeList/:list_id', verifyJWT, userController.updateRecipeList);
router.delete('/:id/recipeList/:list_id', verifyJWT, userController.deleteRecipeList);

router.get('/:id/recipeList/:list_id', verifyJWT, userController.getRecipesInList);
router.post('/:id/recipeList/:list_id/recipe/:recipe_id', verifyJWT, userController.addRecipeToList);
router.delete('/:id/recipeList/:list_id/recipe/:recipe_id', verifyJWT, userController.deleteRecipeFromList);

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
router.patch('/changePassword', verifyJWT, userController.changePassword);

module.exports = router;