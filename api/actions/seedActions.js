/**
 * Filename: seedActions.js
 * Purpose: Aggregates all actions to seed the API.
 */
const axios = require('axios');
const { Category, Area, Ingredient, Recipe } = require('../models');
const { categories, areas, ingredients, recipes } = require('../temporaryData');

const seedCategories = (force) => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
            .then((response) => {
                const responseData = response.data.categories;
                const processedCategories = responseData.map(c => {
                    return new Category({
                        id: parseInt(c.idCategory),
                        name: c.strCategory,
                        description: c.strCategoryDescription,
                        image: c.strCategoryThumb,
                    });
                });

                if(categories.length != 0 && force != true){
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
                reject({ code: 500, msg: error });
            });
    });
}

module.exports.seedCategories = seedCategories;
