/**
 * Filename: temporaryData.js
 * Purpose: Creates a temporary array stored in memory for testing purposes.
 */
const { User, Difficulty, Area, Category, Ingredient, Recipe } = require('./models');

const users = [
    new User({
        id: 1,
        username: "System",
        email: "System@gmail.com",
        password: "System",
        firstName: "User",
        lastName: "System",
        token: "System"
    })
];

const areas = [
    new Area({
        id: 1,
        name: "American"
    })
];

const categories = [
    new Category({
        id: 1,
        name: "Pork",
        description: "Pork is the name given to the meat from the pig, known for its strong flavor and fatty texture.",
        image: "imgPork"
    })
];

const difficulties = [
    new Difficulty({
        id: 1,
        name: "easy"
    })
];

const ingredients = [
    new Ingredient({
        id: 1,
        name: "Peito de frango",
        description: "Good for the protein and budget."
    }),
    new Ingredient({
        id: 2,
        name: "Brocollis",
        description: "Nice vegetable."
    }),
    new Ingredient({
        id: 3,
        name: "Rice",
        description: "Very strong and energetic."
    })
];

const recipe = [
    new Recipe({
        id: 1,
        idProvider: 559,
        name: "Peitinho de frango",
        category: new Category(categories[0]),
        description: "Protein and Protein",
        area: new Area(areas[0]),
        author: new User(users[0]),
        ingredients: null,
        image: "https://fotoDoMeuPeitinho.com",
        preparationTime: "15 minutes in the washing machine",
        difficulty: new Difficulty(difficulties[0]),
        cost: 10.00
    })
];

module.exports.users = users;
module.exports.areas = areas;
module.exports.categories = categories;
module.exports.difficulties = difficulties;
module.exports.ingredients = ingredients;
module.exports.recipe = recipe;