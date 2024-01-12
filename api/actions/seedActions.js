/**
 * Filename: seedActions.js
 * Purpose: Aggregates all actions to seed the API.
 */
const axios = require('axios');
const mysql = require('mysql2');
const connectionOptions = require('./connectionOptions.json');

const { Category, Area, Ingredient, Recipe, IngredientInRecipe } = require('../models');
const { getAreas, truncateAreas, addAreas } = require('./areaActions');
const { getCategories, truncateCategories, addCategories } = require('./categoryActions');
const { getIngredients, truncateIngredients, addIngredients } = require('./ingredientActions');
const { categories, areas, ingredients, recipes } = require('../temporaryData');
const { addIngredient } = require('./ingredientActions');
const { capitalizeWords } = require('../utils');

const commonErrorMessage = 'Something went wrong, please try again later.';

const seedCategories = async (force) => {
    return new Promise( async (resolve, reject) => {
        axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
            .then( async (response) => {
                const responseData = response.data.categories;
                const processedCategories = responseData.map(r => {
                    return new Category({
                        id: parseInt(r.idCategory),
                        name: r.strCategory,
                        description: r.strCategoryDescription,
                        image: r.strCategoryThumb,
                    });
                });

                const categories = (await getCategories()).responseMessage;

                if (categories.length != 0 && !force) {
                    reject({ statusCode: 400, responseMessage: 'Categories must be empty.' });
                    return;
                }

                // Empty array
                await truncateCategories();

                const categoriesWithUpdatedId = (await addCategories(processedCategories)).responseMessage;
                resolve({ statusCode: 200, responseMessage: categoriesWithUpdatedId });
            })
            .catch((error) => {
                console.error(error);
                reject({ statusCode: 500, responseMessage: commonErrorMessage });
            });
    });
}

const seedAreas = async (force) => {
    return new Promise( async (resolve, reject) => {
        axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
            .then( async (response) => {
                const responseData = response.data.meals;
                var id = 1;
                const processedAreas = responseData.map(r => {
                    return new Area({
                        id: id++,
                        name: r.strArea,
                    });
                });

                const areas = (await getAreas()).responseMessage;

                if (areas.length != 0 && !force) {
                    reject({ statusCode: 400, responseMessage: 'Areas must be empty.' });
                    return;
                }

                // Empty array
                await truncateAreas();
                
                const areasWithUpdatedId = (await addAreas(processedAreas)).responseMessage;
                resolve({ statusCode: 200, responseMessage: areasWithUpdatedId });
            })
            .catch((error) => {
                console.error(error);
                reject({ statusCode: 500, responseMessage: commonErrorMessage });
            });
    });
}

const seedIngredients = async (force) => {
    return new Promise( async (resolve, reject) => {
        axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
            .then( async (response) => {
                const responseData = response.data.meals;
                const processedIngredients = responseData.map(r => {
                    return new Ingredient({
                        id: parseInt(r.idIngredient),
                        name: r.strIngredient,
                        description: r.strDescription,
                        image: `https://www.themealdb.com/images/ingredients/${r.strIngredient}.png`
                    });
                });

                const ingredients = (await getIngredients()).responseMessage;

                if (ingredients.length != 0 && !force) {
                    reject({ statusCode: 400, responseMessage: 'Ingredients must be empty.' });
                    return;
                }

                await truncateIngredients();

                const ingredientsWithUpdatedId = (await addIngredients(processedIngredients)).responseMessage;
                resolve({ statusCode: 200, responseMessage: ingredientsWithUpdatedId });
            })
            .catch((error) => {
                console.error(error);
                reject({ statusCode: 500, responseMessage: commonErrorMessage });
            });
    });
}

const seedRecipes = (force) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?f=%');
            const responseData = response.data.meals;
            let id = 1;

            const processedRecipes = responseData.map(async (r) => {
                return new Recipe({
                    id: id++,
                    idProvider: r.idMeal,
                    name: r.strMeal,
                    category: categories.find(c => c.name.toLowerCase() === r.strCategory.toLowerCase()),
                    description: null,
                    preparationDescription: r.strInstructions,
                    area: areas.find(a => a.name.toLowerCase() === r.strArea.toLowerCase()),
                    author: null,
                    ingredients: await addIngredientsInRecipe(r), // Use 'await' here
                    image: r.strMealThumb,
                    preparationTime: null,
                    difficulty: null,
                    cost: null
                });
            });

            if (recipes.length !== 0 && !force) {
                reject({ statusCode: 400, responseMessage: 'Recipes must be empty.' });
                return;
            }

            // Empty array
            recipes.length = 0;

            // 'await Promise.all' to wait for all promises to resolve
            recipes.push(...(await Promise.all(processedRecipes)));

            resolve({ statusCode: 200, responseMessage: recipes });
        } catch (error) {
            console.error(error);
            reject({ statusCode: 500, responseMessage: commonErrorMessage });
        }
    });
};

const seedAll = async (force) => {
    try {
        await seedCategories(force);
        await seedAreas(force);
        await seedIngredients(force);
        await seedRecipes(force);

        return { statusCode: 200, responseMessage: 'All seeding operations completed successfully.' };
    } catch (error) {
        console.error(error);
        throw { statusCode: 500, responseMessage: 'Error during seeding operations.' };
    }
};

module.exports.seedCategories = seedCategories;
module.exports.seedAreas = seedAreas;
module.exports.seedIngredients = seedIngredients;
module.exports.seedRecipes = seedRecipes;
module.exports.seedAll = seedAll;

/**
 * [addIngredients] - Receives a recipe in json from the provider's API and returns an array of valid ingredients.
 *
 * @param {Recipe} recipe - Recipe from the API.
 * @returns {IngredientInRecipe[]} - The processed recipe.
 */
const addIngredientsInRecipe = async (recipe) => {
    let ingredientNumber = 0;

    const processedIngredients = [];
    for (const prop in recipe) {
        if (prop.startsWith("strIngredient") && recipe[prop]) {
            ingredientNumber++;
            let foundIngredient = ingredients.find(i => i.name.toLowerCase().includes(recipe[prop].toLowerCase()));

            if (!foundIngredient) {
                foundIngredient = await addIngredient({
                    name: capitalizeWords(recipe[prop]),
                    description: null,
                    image: null
                });
            }

            const ingredient = new IngredientInRecipe({
                ingredient: new Ingredient({
                    id: foundIngredient.id,
                    name: foundIngredient.name,
                    description: foundIngredient.description,
                    image: foundIngredient.image
                }),
                quantity: recipe["strMeasure" + ingredientNumber]
            });

            processedIngredients.push(ingredient);
        }
    }

    return processedIngredients;
};
