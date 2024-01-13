/**
 * Filename: recipeActions.js
 * Purpose: Aggregates all actions for the Recipe entity.
 */
const mysql = require('mysql2');
const connectionOptions = require('./connectionOptions.json');

const { Recipe, Category, Author, Area, Difficulty, Ingredient, IngredientInRecipe, PartialRecipe } = require('../models');
const { objectIsValid, shuffleArray } = require('../utils');

const { recipes, categories, users, areas, difficulties, ingredients } = require('../temporaryData');

const getRecipes = (queryOptions = null) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);

        let queryString = 'SELECT * FROM search_recipes WHERE 1=1';
        const queryValues = [];

        if (queryOptions?.category) {
            queryString += ' AND category_id = ?';
            queryValues.push(queryOptions.category);
        }

        if (queryOptions?.area) {
            queryString += ' AND area_id = ?';
            queryValues.push(queryOptions.area);
        }

        if (queryOptions?.stringSearch) {
            queryString += ' AND name LIKE ?';
            queryValues.push(`%${queryOptions.stringSearch}%`);
        }

        if (queryOptions?.isRandom) {
            queryString += ' ORDER BY RAND()';
        }

        if (queryOptions?.maxResults) {
            queryString += ' LIMIT ?';
            queryValues.push(queryOptions.maxResults);
        }

        connection.query(queryString, queryValues, (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            const recipes = result.map(r => new Recipe(r));

            resolve({ statusCode: 200, responseMessage: recipes });
        });

        connection.end();
    });
};


const getRecipe = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM search_recipes WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 404, responseMessage: err });
                return;
            }

            if (result.length === 0) {
                reject({ statusCode: 404, responseMessage: 'Recipe not found.' });
                return;
            }

            const recipe = new Recipe(result[0]);

            resolve({ statusCode: 200, responseMessage: recipe });
        });

        connection.end();
    });
}

const addRecipe = (recipe) => {
    return new Promise((resolve, reject) => {
        const id = (recipes.length == 0) ? 1 : recipes.at(-1).id + 1;

        try {
            const processedRecipe = processRecipeData(recipe);
            const newRecipe = new Recipe(processedRecipe, id);

            if (objectIsValid(newRecipe)) {
                recipes.push(newRecipe);
                resolve({ statusCode: 201, responseMessage: newRecipe });
            } else {
                reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
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
                reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            } else if (oldRecipe == null) {
                reject({ statusCode: 404, responseMessage: 'Recipe not found.' });
            } else {
                for (prop in processedRecipe) {
                    oldRecipe[prop] = processedRecipe[prop];
                }
                resolve({ statusCode: 200, responseMessage: oldRecipe });
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
            reject({ statusCode: 404, responseMessage: 'Recipe not found.' })
            return;
        }

        recipes.splice(recipeIndex, 1);

        resolve({ statusCode: 200, responseMessage: 'Recipe deleted sucessfully.' });
    })
}

module.exports.getRecipes = getRecipes;
module.exports.getRecipe = getRecipe;
module.exports.addRecipe = addRecipe;
module.exports.editRecipe = editRecipe;
module.exports.deleteRecipe = deleteRecipe;

/**
 * [ingredientsAreDuplicate] - Checks for duplicated.
 *
 * @param {Object} ingredientsIds - ids and quantities of a recipe.
 * @returns {boolean} - There are either duplicates or not.
 */
const ingredientsAreDuplicate = (ingredientsIds) => {
    const set = new Set();

    for (const ingredient of ingredientsIds) {
        const id = ingredient.id;

        if (set.has(id)) return true;

        set.add(id);
    }

    return false;
};

/**
 * [processRecipeData] - Processes a recipe in order to validate it and insert it.
 *
 * @param {Recipe} recipe - Recipe before being processed.
 * @returns {Recipe} - The processed recipe.
 * @throws {Object} - An error object with a status statusCode and descriptive message.
 */
const processRecipeData = (recipe) => {
    // Check category 
    const categoryId = recipe.category.id;
    const foundCategory = categories.find(c => c.id == categoryId);

    if (foundCategory == null) {
        throw { statusCode: 400, responseMessage: 'Recipe category not found.' };
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
        throw { statusCode: 400, responseMessage: 'Recipe area not found.' };
    }

    const area = new Area({
        id: areaId,
        name: foundArea.name
    });

    // Check difficulty 
    const difficultyId = recipe.difficulty.id;
    const foundDifficulty = difficulties.find(d => d.id == difficultyId);
    if (foundDifficulty == null) {
        throw { statusCode: 400, responseMessage: 'Recipe difficulty not found.' };
    }

    const difficulty = new Difficulty({
        id: difficultyId,
        name: foundDifficulty.name
    });

    // Check author (Nullable)
    const authorId = recipe.author ? recipe.author.id : null;
    const foundAuthor = users.find(c => c.id == authorId);
    var author = null;

    if (foundAuthor != null) {
        author = new Author({
            id: authorId,
            username: foundAuthor.username,
            firstName: foundAuthor.firstName,
            lastName: foundAuthor.lastName
        });
    }

    // Check ingredients
    const ingredientsIds = recipe.ingredients.map(i => {
        if (i.quantity == undefined) {
            throw { statusCode: 400, responseMessage: `Recipe ingredient with id=${i.ingredient.id} quantity not found.` };
        }

        return { id: i.ingredient.id, quantity: i.quantity };
    });

    if (ingredientsAreDuplicate(ingredientsIds)) {
        throw { statusCode: 400, responseMessage: `Recipe ingredient can't have duplicates.` };
    }

    const finalIngredients = [];
    ingredientsIds.forEach(ingredient => {
        const foundIngredient = ingredients.find(i => i && i.id == ingredient.id);
        if (foundIngredient == null) {
            throw { statusCode: 400, responseMessage: `Recipe ingredient with id=${ingredient.id} not found.` };
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