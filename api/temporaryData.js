/**
 * Filename: temporaryData.js
 * Purpose: Creates a temporary array stored in memory for testing purposes.
 */
const { User, Difficulty, Area, Category } = require('./models');

const users = [new User(
    {
        id: 1,
        username: "System",
        email: "System@gmail.com",
        password: "System",
        firstName: "User",
        lastName: "System",
        token: "System"
    }
)];

const areas = [new Area(
    {
        id: 1,
        name: "American"
    }
)]

const categories = [new Category(
    {
        id: 1,
        name: "Pork",
        description: "Pork is the name given to the meat from the pig, known for its strong flavor and fatty texture.",
        image: "imgPork"
    }
)]

const difficulties = [new Difficulty(
    {
        id: 1,
        name: "testDifficulty"
    }
)]

module.exports.users = users;
module.exports.areas = areas;
module.exports.categories = categories;
module.exports.difficulties = difficulties;