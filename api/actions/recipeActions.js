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

const processRecipeData = (recipe) => {
    // Check category 
    const categoryId = recipe.category.id;
    const foundCategory = categories.find(c => c.id == categoryId);

    if (foundCategory == null) {
        throw { code: 400, msg: 'Recipe category not found.' };
    }

    const category = new Category({
        id: categoryId,
        name: foundCategory.name,
        description: foundCategory.description,
        image: foundCategory.image
    });

    // Check area 
    const areaId = recipe.area.id;
    const foundArea = areas.find(a => a.id == areaId);
    if (foundArea == null) {
        throw { code: 400, msg: 'Recipe area not found.' };
    }

    const area = new Area({
        id: areaId,
        name: foundArea.name
    });

    // Check difficulty 
    const difficultyId = recipe.difficulty.id;
    const foundDifficulty = difficulties.find(d => d.id == difficultyId);
    if (foundDifficulty == null) {
        throw { code: 400, msg: 'Recipe difficulty not found.' };
    }

    const difficulty = new Difficulty({
        id: difficultyId,
        name: foundDifficulty.name
    });

    // Check author
    const authorId = recipe.author.id;
    const foundAuthor = users.find(c => c.id == authorId);

    if (foundAuthor == null) {
        throw { code: 400, msg: 'Recipe author not found.' };
    }

    const author = new Author({
        id: authorId,
        username: foundAuthor.username,
        firstName: foundAuthor.firstName,
        lastName: foundAuthor.lastName
    });

    // Check ingredients
    const ingredientsIds = recipe.ingredients.map(i => {
        if (i.quantity == undefined) {
            throw { code: 400, msg: `Recipe ingredient with id=${i.ingredient.id} quantity not found.` };
        }

        return { id: i.ingredient.id, quantity: i.quantity };
    });

    const finalIngredients = [];
    ingredientsIds.forEach(ingredient => {
        const foundIngredient = ingredients.find(i => i && i.id == ingredient.id);
        if (foundIngredient == null) {
            throw { code: 400, msg: `Recipe ingredient with id=${ingredient.id} not found.` };
        }

        const finalIngredient = new IngredientInRecipe({
            ingredient: new Ingredient({
                id: ingredient.id,
                name: foundIngredient.name,
                description: foundIngredient.description
            }),
            quantity: ingredient.quantity
        });
        finalIngredients.push(finalIngredient);
    });

    // Assign calculated values
    recipe.category = category;
    recipe.area = area;
    recipe.difficulty = difficulty;
    recipe.author = author;
    recipe.ingredients = finalIngredients;

    return recipe;
};

const addRecipe = (recipe) => {
    return new Promise((resolve, reject) => {
        const id = (recipes.length == 0) ? 1 : recipes.at(-1).id + 1;

        try {
            const processedRecipe = processRecipeData(recipe);
            const newRecipe = new Recipe(processedRecipe, id);

            if (objectIsValid(newRecipe)) {
                recipes.push(newRecipe);
                resolve({ code: 201, msg: newRecipe });
            } else {
                reject({ code: 400, msg: 'Invalid Body.' });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const editRecipe = (id, recipe) => {
    return new Promise((resolve, reject) => {
        try {
            const processedRecipe = processRecipeData(recipe);
            processedRecipe.id = id;
            
            const oldRecipe = recipes.find(a => a.id == id);

            if (!objectIsValid(processedRecipe)) {
                reject({ code: 400, msg: 'Invalid body.' });
            } else if (oldRecipe == null) {
                reject({ code: 404, msg: 'Recipe not found.' });
            } else {
                for (prop in processedRecipe) {
                    oldRecipe[prop] = processedRecipe[prop];
                }
                resolve({ code: 200, msg: oldRecipe });
            }
        } catch (error) {
            reject(error);
        }
    });
};

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