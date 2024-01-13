/**
 * Filename: recipeActions.js
 * Purpose: Aggregates all actions for the Recipe entity.
 */
const mysql = require('mysql2');
const async = require('async');
const connectionOptions = require('./connectionOptions.json');

const { Recipe, Category, Author, Area, Difficulty, Ingredient, IngredientInRecipe, PartialRecipe } = require('../models');
const { objectIsValid } = require('../utils');
const { getCategory } = require('./categoryActions');
const { getArea } = require('./areaActions');
const { getDifficulty } = require('./difficultyActions');
const { getUser } = require('./userActions');

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

const addRecipe = async (recipe) => {
    return new Promise(async (resolve, reject) => {
        try {
            const processedRecipe = await processRecipeData(recipe);
            const newRecipe = new Recipe(processedRecipe);

            if (!objectIsValid(newRecipe)) {
                reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
                return;
            }

            const pool = mysql.createPool(connectionOptions);

            pool.getConnection(async (err, connection) => {
                if (err) {
                    console.error(err);
                    reject({ statusCode: 500, responseMessage: 'Connection Error.' });
                    return;
                }

                connection.beginTransaction(async (err) => {
                    if (err) {
                        console.error(err);
                        connection.release();
                        reject({ statusCode: 500, responseMessage: 'Transaction Begin Error.' });
                        return;
                    }

                    try {
                        const recipeQuery = "INSERT INTO recipe (name, description, image, preparation_description, area_id, category_id, author_id, difficulty_id, preparationTime, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        const recipeValues = [
                            newRecipe.name, newRecipe.description, newRecipe.image,
                            newRecipe.preparationDescription, newRecipe.area.id, newRecipe.category.id,
                            newRecipe.author.id, newRecipe.difficulty.id, newRecipe.preparation, newRecipe.cost
                        ];

                        connection.query(recipeQuery, recipeValues, async (err, result) => {
                            if (err) {
                                console.error(err);
                                connection.rollback(() => {
                                    connection.release();
                                    reject({ statusCode: 400, responseMessage: err });
                                });
                                return;
                            }

                            const ingredientsQueries = newRecipe.ingredients.map(i => {
                                return ["INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)", [result.insertId, i.ingredient.id, i.quantity]];
                            });

                            async.each(ingredientsQueries, (query, callback) => {
                                connection.query(...query, (err, result) => {
                                    if (err) {
                                        console.error(err);
                                        connection.rollback(() => {
                                            connection.release();
                                            reject({ statusCode: 400, responseMessage: [newRecipe, "Ingredients not added"] });
                                        });
                                        return callback(err);
                                    }
                                    callback();
                                });
                            }, (err) => {
                                if (err) {
                                    connection.rollback(() => {
                                        connection.release();
                                        reject({ statusCode: 500, responseMessage: 'Transaction Error.' });
                                    });
                                    return;
                                }

                                connection.commit((err) => {
                                    if (err) {
                                        console.error(err);
                                        connection.rollback(() => {
                                            connection.release();
                                            reject({ statusCode: 500, responseMessage: 'Commit Error.' });
                                        });
                                        return;
                                    }

                                    connection.release();
                                    newRecipe.id = result.insertId;
                                    resolve({ statusCode: 200, responseMessage: newRecipe });
                                });
                            });
                        });
                    } catch (error) {
                        connection.rollback(() => {
                            connection.release();
                            reject({ statusCode: 500, responseMessage: error });
                        });
                    }
                });
            });

        } catch (error) {
            reject({ statusCode: 500, responseMessage: error });
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
    return new Promise(async (resolve, reject) => {
        try {
            // Check category 
            const categoryId = recipe.category.id;
            const foundCategory = (await getCategory(categoryId)).responseMessage;

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
            const foundArea = (await getArea(areaId)).responseMessage;

            if (foundArea == null) {
                throw { statusCode: 400, responseMessage: 'Recipe area not found.' };
            }
            const area = new Area({
                id: areaId,
                name: foundArea.name
            });

            // Check difficulty 
            const difficultyId = recipe.difficulty.id;
            const foundDifficulty = (await getDifficulty(difficultyId)).responseMessage;
            if (foundDifficulty == null) {
                throw { statusCode: 400, responseMessage: 'Recipe difficulty not found.' };
            }

            const difficulty = new Difficulty({
                id: difficultyId,
                name: foundDifficulty.name
            });

            // Check author (Nullable)
            const authorId = recipe.author ? recipe.author.id : null;
            const foundAuthor = (await getUser(authorId)).responseMessage;
            let author = null;

            if (foundAuthor != null) {
                author = new Author({
                    id: authorId,
                    username: foundAuthor.username,
                    firstName: foundAuthor.firstName,
                    lastName: foundAuthor.lastName
                });
            } else {
                // System
                foundAuthor = (await getUser(1)).responseMessage;
            }

            // Assign calculated values
            recipe.category = category;
            recipe.area = area;
            recipe.difficulty = difficulty;
            recipe.author = author;

            resolve(recipe);
        } catch (error) {
            reject(error);
        }
    });
};
