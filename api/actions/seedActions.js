/**
 * Filename: seedActions.js
 * Purpose: Aggregates all actions to seed the API.
 */
const axios = require('axios');
const { Category, Area, Ingredient, Recipe } = require('../models');
const { categories, areas, ingredients, recipes } = require('../temporaryData');

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

module.exports.seedCategories = seedCategories;
module.exports.seedAreas = seedAreas;
module.exports.seedIngredients = seedIngredients;
