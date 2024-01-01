/**
 * Filename: seedActions.js
 * Purpose: Aggregates all actions to seed the API.
 */
const axios = require('axios');
const { Category, Area, Ingredient, Recipe, IngredientInRecipe } = require('../models');
const { categories, areas, ingredients, recipes } = require('../temporaryData');
const { addIngredient } = require('./ingredientActions');
const { capitalizeWords } = require('../utils');

const commonErrorMessage = 'Something went wrong, please try again later.';

const seedCategories = (force) => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
            .then((response) => {
                const responseData = response.data.categories;
                const processedCategories = responseData.map(r => {
                    return new Category({
                        id: parseInt(r.idCategory),
                        name: r.strCategory,
                        description: r.strCategoryDescription,
                        image: r.strCategoryThumb,
                    });
                });

                if (categories.length != 0 && !force) {
                    reject({ code: 400, msg: 'Categories must be empty.' });
                    return;
                }

                // Empty array
                categories.length = 0;

                categories.push(...processedCategories);
                resolve({ code: 200, msg: processedCategories });
            })
            .catch((error) => {
                console.error(error);
                reject({ code: 500, msg: commonErrorMessage });
            });
    });
}

const seedAreas = (force) => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
            .then((response) => {
                const responseData = response.data.meals;
                var id = 1;
                const processedAreas = responseData.map(r => {
                    return new Area({
                        id: id++,
                        name: r.strArea,
                    });
                });

                if (areas.length != 0 && !force) {
                    reject({ code: 400, msg: 'Areas must be empty.' });
                    return;
                }

                // Empty array
                areas.length = 0;

                areas.push(...processedAreas);
                resolve({ code: 200, msg: processedAreas });
            })
            .catch((error) => {
                console.error(error);
                reject({ code: 500, msg: commonErrorMessage });
            });
    });
}

const seedIngredients = (force) => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
            .then((response) => {
                const responseData = response.data.meals;
                const processedIngredients = responseData.map(r => {
                    return new Ingredient({
                        id: parseInt(r.idIngredient),
                        name: r.strIngredient,
                        description: r.strDescription
                    });
                });

                if (ingredients.length != 0 && !force) {
                    reject({ code: 400, msg: 'Ingredients must be empty.' });
                    return;
                }

                // Empty array
                ingredients.length = 0;

                ingredients.push(...processedIngredients);
                resolve({ code: 200, msg: processedIngredients });
            })
            .catch((error) => {
                console.error(error);
                reject({ code: 500, msg: commonErrorMessage });
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
                    ingredients: await addIngredients(r), // Use 'await' here
                    image: r.strMealThumb,
                    preparationTime: null,
                    difficulty: null,
                    cost: null
                });
            });

            if (recipes.length !== 0 && !force) {
                reject({ code: 400, msg: 'Recipes must be empty.' });
                return;
            }

            // Empty array
            recipes.length = 0;

            // 'await Promise.all' to wait for all promises to resolve
            recipes.push(...(await Promise.all(processedRecipes)));

            resolve({ code: 200, msg: recipes });
        } catch (error) {
            console.error(error);
            reject({ code: 500, msg: commonErrorMessage });
        }
    });
};

const seedAll = async (force) => {
    try {
        await seedCategories(force);
        await seedAreas(force);
        await seedIngredients(force);
        await seedRecipes(force);

        return { code: 200, msg: 'All seeding operations completed successfully.' };
    } catch (error) {
        console.error(error);
        throw { code: 500, msg: 'Error during seeding operations.' };
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
const addIngredients = async (recipe) => {
    let ingredientNumber = 0;

    const processedIngredients = [];
    for (const prop in recipe) {
        if (prop.startsWith("strIngredient") && recipe[prop]) {
            ingredientNumber++;
            let foundIngredient = ingredients.find(i => i.name.toLowerCase().includes(recipe[prop].toLowerCase()));

            if (!foundIngredient) {
                foundIngredient = await addIngredient({
                    name: capitalizeWords(recipe[prop]),
                    description: null
                });
            }

            const ingredient = new IngredientInRecipe({
                ingredient: new Ingredient({
                    id: foundIngredient.id,
                    name: foundIngredient.name,
                    description: foundIngredient.description
                }),
                quantity: recipe["strMeasure" + ingredientNumber]
            });

            processedIngredients.push(ingredient);
        }
    }

    return processedIngredients;
};
