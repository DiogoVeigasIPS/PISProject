/**
 * Filename: recipeActions.js
 * Purpose: Aggregates all actions for the Recipe entity.
 */
const { Recipe, Category, Author, Area, Difficulty, Ingredient, IngredientInRecipe } = require('../models');
const { objectIsValid } = require('../utils');

const { recipes, categories, users, areas, difficulties, ingredients } = require('../temporaryData');

// TODO (methods need change)
// Get and gets change user to Author
// Fix Add

const getRecipes = () => {
    return new Promise((resolve, reject) => {
        resolve({ code: 200, msg: recipes });
    });
}

const getRecipe = (id) => {
    return new Promise((resolve, reject) => {
        const recipe = recipes.find(a => a.id == id)
        if (recipe == null) {
            reject({ code: 404, msg: 'Recipe not found.' });
        }
        resolve({ code: 201, msg: recipe })
    });
}

const addRecipe = (recipe) => {
    return new Promise((resolve, reject) => {
        const id = (recipes.length == 0) ? 1 : recipes.at(-1).id + 1;

        // Check category 
        const categoryId = recipe.category.id;
        const foundCategory = categories.find(c => c.id = categoryId);

        const category = new Category({
            id: categoryId,
            category: foundCategory.category,
            description: foundCategory.description,
            image: foundCategory.image
        });

        // // Check area 
        const areaId = recipe.area.id;
        const foundArea = areas.find(a => a.id = areaId);

        const area = new Area({
            id: areaId,
            name: foundArea.name
        });

        // Check difficulty 
        const difficultyId = recipe.difficulty.id;
        const foundDifficulty = difficulties.find(d => d.id = difficultyId);

        const difficulty = new Difficulty({
            id: difficultyId,
            name: foundDifficulty.name
        });

        // Check author
        const authorId = recipe.difficulty.id;
        const foundAuthor = users.find(c => c.id = authorId);

        const author = new Author({
            id: authorId,
            username: foundAuthor.username,
            firstName: foundAuthor.firstName,
            lastName: foundAuthor.lastName
        });

        // Check ingredients
        const ingredientsIds = recipe.ingredients.map(i => {
            return { id: i.ingredient.id, quantity: i.ingredient.quantity };
        });
        
        const finalIngredients = [];
        ingredientsIds.forEach(ingredient => {
            const foundIngredient = ingredients.find(i => i && i.id === ingredient.id);

            if (foundIngredient) {
                const finalIngredient = new IngredientInRecipe({
                    ingredient: new Ingredient({
                        id: ingredient.id,
                        name: foundIngredient.name,
                        description: foundIngredient.description
                    }),
                    quantity: ingredient.quantity
                });
                finalIngredients.push(finalIngredient);
            } else {
                console.error(`Ingredient with ID ${ingredient.id} not found.`);
            }
        });

        // // Assign calculated values
        recipe.category = category;
        recipe.area = area;
        recipe.difficulty = difficulty;
        recipe.author = author;
        recipe.ingredients = finalIngredients;

        const newRecipe = new Recipe(recipe, id);
        if (objectIsValid(newRecipe)) {
            recipes.push(newRecipe);
            resolve({ code: 201, msg: newRecipe });
            return;
        }
        
        reject({ code: 400, msg: 'Invalid Body.' });
    })
}

const editRecipe = (id, recipe) => {
    return new Promise((resolve, reject) => {
        const newRecipe = new Recipe(recipe, id);
        const oldRecipe = recipes.find(a => a.id == id);

        if (!objectIsValid(newRecipe)) {
            reject({ code: 400, msg: 'Invalid body.' });
            return;
        }

        if (oldRecipe == null) {
            reject({ code: 404, msg: 'Recipe not found.' });
            return;
        }

        for (prop in newRecipe) {
            oldRecipe[prop] = newRecipe[prop];
        }

        resolve({ code: 200, msg: oldRecipe });
    })
}

const deleteRecipe = (id) => {
    return new Promise((resolve, reject) => {
        const recipeIndex = recipes.findIndex(a => a.id == id);

        if (recipeIndex == -1) {
            reject({ code: 404, msg: 'Recipe not found.' })
            return;
        }

        recipes.splice(recipeIndex, 1);

        resolve({ code: 200, msg: 'Recipe deleted sucessfully.' });
    })
}

module.exports.getRecipes = getRecipes;
module.exports.getRecipe = getRecipe;
module.exports.addRecipe = addRecipe;
module.exports.editRecipe = editRecipe;
module.exports.deleteRecipe = deleteRecipe;