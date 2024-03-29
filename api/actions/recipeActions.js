/**
 * Filename: recipeActions.js
 * Purpose: Aggregates all actions for the Recipe entity.
 */
const mysql = require('mysql2');
const async = require('async');
const connectionOptions = require('./connectionOptions');

const { Recipe } = require('../models');
const { objectIsValid, handleDatabaseError } = require('../utils');

const getRecipes = (queryOptions = null) => {
    return new Promise((resolve, reject) => {
        const baseQueryString = queryOptions?.isPartial ?
            queryOptions?.isNamed ? 'SELECT * FROM partial_named_search_recipes WHERE 1=1' :
                'SELECT * FROM partial_search_recipes WHERE 1=1' :
            'SELECT * FROM search_recipes WHERE 1=1';
        let queryString = baseQueryString;

        const queryParams = [];

        if (queryOptions) {
            queryString += queryOptions.category ? " AND category_id = ?" : "";
            queryString += queryOptions.area ? " AND area_id = ?" : "";
            queryString += queryOptions.author ? " AND author_id = ?" : "";
            queryString += queryOptions.difficulty ? " AND difficulty_id = ?" : "";
            queryString += queryOptions.stringSearch ? " AND name LIKE ?" : "";
            queryString += queryOptions.isRandom ? " ORDER BY RAND()" : "";
            queryString += queryOptions.orderBy ? " ORDER BY ?? asc" : "";

            if (!queryOptions.orderBy && !queryOptions.isRandom) {
                queryString += " ORDER BY id";
            }

            queryString += queryOptions.maxResults ? " LIMIT ?" : "";

            if (queryOptions.category) {
                queryParams.push(queryOptions.category);
            }
            if (queryOptions.area) {
                queryParams.push(queryOptions.area);
            }
            if (queryOptions.author) {
                queryParams.push(queryOptions.author);
            }
            if (queryOptions.difficulty) {
                queryParams.push(queryOptions.difficulty);
            }
            if (queryOptions.stringSearch) {
                queryParams.push(`%${queryOptions.stringSearch}%`);
            }
            if (queryOptions.orderBy) {
                queryParams.push(queryOptions.orderBy);
            }
            if (queryOptions.maxResults) {
                queryParams.push(queryOptions.maxResults);
            }
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query(queryString, queryParams, (err, result) => {
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

const addRecipe = async (recipe, authorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            //const processedRecipe = await processRecipeData(recipe);
            const newRecipe = new Recipe(recipe);

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
                            newRecipe.author ? authorId : null, newRecipe.difficulty.id,
                            newRecipe.preparation, newRecipe.cost
                        ];

                        connection.query(recipeQuery, recipeValues, async (err, result) => {
                            if (err) {
                                console.error(err);
                                connection.rollback(() => {
                                    connection.release();

                                    const errorResponse = handleDatabaseError(err);
                                    reject(errorResponse);
                                    return;
                                });
                                return;
                            }

                            const ingredientsQueries = newRecipe.ingredients.map(i => {
                                return ["INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)", [result.insertId, i.ingredient.id, i.quantity]];
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

                                connection.commit(async (err) => {
                                    if (err) {
                                        console.error(err);
                                        connection.rollback(() => {
                                            connection.release();
                                            reject({ statusCode: 500, responseMessage: 'Commit Error.' });
                                        });
                                        return;
                                    }

                                    connection.release();

                                    //newRecipe.id = result.insertId;
                                    const addedRecipe = (await getRecipe(result.insertId)).responseMessage;
                                    resolve({ statusCode: 200, responseMessage: addedRecipe });
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
    return new Promise(async (resolve, reject) => {
        //const processedRecipe = await processRecipeData(recipe);
        const newRecipe = new Recipe(recipe);

        if (!objectIsValid(newRecipe)) {
            reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();
        connection.query("UPDATE recipe SET name = ?, description = ?, image = ?, preparation_description = ?, area_id = ?, category_id = ?, author_id = ?, difficulty_id = ?, preparationTime = ?, cost= ? WHERE id = ?",
            [newRecipe.name, newRecipe.description, newRecipe.image,
            newRecipe.preparationDescription, newRecipe.area.id, newRecipe.category.id, newRecipe.author.id,
            newRecipe.difficulty.id, newRecipe.preparationTime, newRecipe.cost, id],
            async (err, result) => {
                if (err) {
                    console.error(err);

                    const errorResponse = handleDatabaseError(err);
                    reject(errorResponse);
                    return;
                }

                if (result.affectedRows == 0) {
                    return reject({ statusCode: 404, responseMessage: 'Recipe not found.' });
                }

                try{
                    const response = (await setRecipeIngredients(id, newRecipe.ingredients));
    
                    if (response.statusCode != 201) {
                        return reject(response);
                    }
    
                    //newRecipe.id = id;
                    const edittedRecipe = (await getRecipe(id)).responseMessage;
                    resolve({ statusCode: 200, responseMessage: edittedRecipe });
                }catch(err){
                    reject(err);
                }
            });

        connection.end();
    });
};

const deleteRecipe = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("DELETE FROM recipe WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                if (err.sqlMessage.includes('a foreign key constraint fails')) {
                    return reject({ statusCode: 422, responseMessage: 'That recipe is being favorited.' });
                }
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            if (result.affectedRows > 0) {
                resolve({ statusCode: 200, responseMessage: 'Recipe deleted sucessfully.' });
            } else {
                reject({ statusCode: 404, responseMessage: 'Recipe not found.' });
            }
        });

        connection.end();
    });
}

const addRecipes = async (recipes) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = mysql.createPool(connectionOptions);

            pool.getConnection(async (err, connectionToUse) => {
                if (err) {
                    console.error(err);
                    reject({ statusCode: 500, responseMessage: 'Connection Error.' });
                    return;
                }

                connectionToUse.beginTransaction(async (err) => {
                    if (err) {
                        console.error(err);
                        connectionToUse.release();
                        reject({ statusCode: 500, responseMessage: 'Transaction Begin Error.' });
                        return;
                    }

                    try {
                        const insertPromises = recipes.map(async (recipe) => {
                            const processedRecipe = await processRecipeData(recipe, true);

                            const newRecipe = new Recipe(processedRecipe);

                            if (!objectIsValid(newRecipe)) {
                                throw { statusCode: 400, responseMessage: 'Invalid Body.' };
                            }

                            const recipeQuery = "INSERT IGNORE INTO recipe (name, description, image, preparation_description, area_id, category_id, author_id, difficulty_id, preparationTime, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                            const recipeValues = [
                                newRecipe.name, newRecipe.description, newRecipe.image,
                                newRecipe.preparationDescription, newRecipe.area.id, newRecipe.category.id,
                                newRecipe.author.id, newRecipe.difficulty ? newRecipe.difficulty.id : null, newRecipe.preparation, newRecipe.cost
                            ];

                            return new Promise((resolve, reject) => {
                                connectionToUse.query(recipeQuery, recipeValues, async (err, result) => {
                                    if (err) {
                                        console.error(err);
                                        connectionToUse.rollback(() => {
                                            reject({ statusCode: 400, responseMessage: err });
                                        });
                                        return;
                                    }

                                    const ingredientsQueries = newRecipe.ingredients.map(i => {
                                        return ["INSERT IGNORE INTO recipe_ingredient (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)", [result.insertId, i.ingredient.id, i.quantity]];
                                    });

                                    async.each(ingredientsQueries, (query, callback) => {
                                        connectionToUse.query(...query, (err, result) => {
                                            if (err) {
                                                console.error(err);
                                                connectionToUse.rollback(() => {
                                                    reject({ statusCode: 400, responseMessage: [newRecipe, "Ingredients not added"] });
                                                });
                                                return callback(err);
                                            }
                                            callback();
                                        });
                                    }, (err) => {
                                        if (err) {
                                            connectionToUse.rollback(() => {
                                                reject({ statusCode: 500, responseMessage: 'Transaction Error.' });
                                            });
                                            return;
                                        }

                                        resolve(result.insertId);
                                    });
                                });
                            });
                        });

                        const insertResults = await Promise.all(insertPromises);

                        connectionToUse.commit((err) => {
                            if (err) {
                                console.error(err);
                                connectionToUse.rollback(() => {
                                    reject({ statusCode: 500, responseMessage: 'Commit Error.' });
                                });
                                return;
                            }

                            connectionToUse.release();

                            resolve({ statusCode: 200, responseMessage: 'Recipes added successfully.' });
                        });
                    } catch (error) {
                        connectionToUse.rollback(() => {
                            connectionToUse.release();
                            reject(error);
                        });
                    }
                });
            });
        } catch (error) {
            reject({ statusCode: 500, responseMessage: error });
        }
    });
};

const truncateRecipes = () => {
    return new Promise((resolve, reject) => {
        const multipleStatementsOptions = { ...connectionOptions };
        multipleStatementsOptions.multipleStatements = true;

        const connection = mysql.createConnection(multipleStatementsOptions);
        connection.connect();

        const queryString = `
            SET FOREIGN_KEY_CHECKS = 0;
            TRUNCATE TABLE recipe;
            SET FOREIGN_KEY_CHECKS = 1;
            DELETE FROM recipe_list_item;
            DELETE FROM recipe_ingredient;
            DELETE FROM favorite_recipe;
        `;

        connection.query(queryString, (truncateErr, truncateResult) => {
            if (truncateErr) {
                console.error(truncateErr);
                reject({ statusCode: 500, responseMessage: truncateErr });
                return;
            }

            resolve({ statusCode: 200, responseMessage: 'Recipes and associated data truncated successfully.' });
        });

        connection.end();
    });
};

// Manage ingredients in a recipe
const addIngredientToRecipe = (recipeId, ingredientId, quantity) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)",
            [recipeId, ingredientId, quantity], (err, result) => {
                if (err) {
                    console.error(err);

                    const errorResponse = handleDatabaseError(err);
                    reject(errorResponse);
                    return;
                }

                resolve({ statusCode: 200, responseMessage: 'Ingredient added sucessfully.' });
            });

        connection.end();
    })
}

const editIngredientQuantityInRecipe = (recipeId, ingredientId, newQuantity) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("UPDATE recipe_ingredient SET quantity = ? WHERE recipe_id = ? AND ingredient_id = ?",
            [newQuantity, recipeId, ingredientId], (err, result) => {
                if (err) {
                    console.error(err);
                    const errorResponse = handleDatabaseError(err);
                    reject(errorResponse);
                    return;
                }

                if (result.affectedRows === 0) {
                    reject({ statusCode: 404, responseMessage: 'Ingredient not found in recipe.' });
                    return;
                }

                resolve({ statusCode: 200, responseMessage: 'Ingredient quantity updated successfully.' });
            });

        connection.end();
    });
};

const removeIngredientFromRecipe = (recipeId, ingredientId) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("DELETE FROM recipe_ingredient WHERE recipe_id = ? AND ingredient_id = ?",
            [recipeId, ingredientId], (err, result) => {
                if (err) {
                    console.error(err);
                    const errorResponse = handleDatabaseError(err);
                    reject(errorResponse);
                    return;
                }

                if (result.affectedRows === 0) {
                    reject({ statusCode: 404, responseMessage: 'Ingredient not found in recipe.' });
                    return;
                }

                resolve({ statusCode: 200, responseMessage: 'Ingredient removed successfully.' });
            });

        connection.end();
    });
};

const setRecipeIngredients = (recipeId, ingredients) => {
    return new Promise((resolve, reject) => {
        const multipleStatementsOptions = { ...connectionOptions };
        multipleStatementsOptions.multipleStatements = true;

        const connection = mysql.createConnection(multipleStatementsOptions);
        connection.connect();

        const deleteQuery = "DELETE FROM recipe_ingredient WHERE recipe_id = ?";
        const insertQuery = "INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity) VALUES ?";


        const processedIngredients = ingredients.map(i => { return { ingredientId: i.ingredient.id, quantity: i.quantity } });
        const values = processedIngredients.map(({ ingredientId, quantity }) => [recipeId, ingredientId, quantity]);

        // Combine delete and insert queries using ;
        const combinedQuery = `${deleteQuery}; ${insertQuery}`;

        connection.query(combinedQuery, [recipeId, values], (err, result) => {
            if (err) {
                console.error(err);
                const errorResponse = handleDatabaseError(err);
                reject(errorResponse);
                return;
            }

            resolve({ statusCode: 201, responseMessage: 'Ingredients added successfully.' });
            connection.end();
        });
    });
};

module.exports.getRecipes = getRecipes;
module.exports.getRecipe = getRecipe;
module.exports.addRecipe = addRecipe;
module.exports.editRecipe = editRecipe;
module.exports.deleteRecipe = deleteRecipe;
module.exports.addIngredientToRecipe = addIngredientToRecipe;
module.exports.editIngredientQuantityInRecipe = editIngredientQuantityInRecipe;
module.exports.removeIngredientFromRecipe = removeIngredientFromRecipe;
module.exports.addRecipes = addRecipes;
module.exports.truncateRecipes = truncateRecipes;
module.exports.setRecipeIngredients = setRecipeIngredients;

/**
 * [processRecipeData] - Processes a recipe in order to validate it and insert it.
 *
 * @param {Recipe} recipe - Recipe before being processed.
 * @param {Recipe} seeding - Defines if the recipe is seeded (from provider API), or inserted manually.
 * @returns {Recipe} - The processed recipe.
 * @throws {Object} - An error object with a status statusCode and descriptive message.
 */
const processRecipeData = (recipe, seeding = false) => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(recipe);
        } catch (error) {
            reject(error);
        }
    });
};

