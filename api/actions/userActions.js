/**
 * Filename: userController.js
 * Purpose: Aggregates all actions for the User entity.
 */
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const connectionOptions = require('./connectionOptions');

const { User } = require('../models');
const { objectIsValid, handleDatabaseError } = require('../utils');
const { getJWT } = require('../jsonWebToken');

const getUsers = () => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM user ORDER BY id", (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            const users = result.map(r => new User(r));

            resolve({ statusCode: 200, responseMessage: users });
        });

        connection.end();
    });
}

const getUser = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM user WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            if (result.length == 0) {
                reject({ statusCode: 404, responseMessage: 'User not found.' });
                return;
            }

            const user = new User(result[0]);

            resolve({ statusCode: 200, responseMessage: user });
        });

        connection.end();
    });
}

const addUser = (user) => {
    return new Promise(async (resolve, reject) => {
        const newUser = new User(user);

        if (!objectIsValid(newUser)) {
            reject({ statusCode: 400, responseMessage: 'Invalid Body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;

        connection.query("INSERT INTO user (username, email, password, firstName, lastName, image) VALUES (?, ?, ?, ?, ?, ?)",
            [newUser.username, newUser.email, newUser.password, newUser.firstName, newUser.lastName, newUser.image],
            (err, result) => {
                if (err) {
                    const errorResponse = handleDatabaseError(err);
                    reject(errorResponse);
                    return;
                }

                newUser.id = result.insertId;
                resolve({ statusCode: 200, responseMessage: newUser });
            });

        connection.end();
    });
}

const editUser = (id, user) => {
    return new Promise(async (resolve, reject) => {
        const newUser = new User(user);

        if (!objectIsValid(newUser)) {
            reject({ statusCode: 400, responseMessage: 'Invalid body.' });
            return;
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;

        connection.query("UPDATE user SET username = ?, email = ?, firstName = ?, lastName = ?, image = ?, isAdmin = ? WHERE id = ?",
            [newUser.username, newUser.email, newUser.firstName, newUser.lastName, newUser.image, newUser.isAdmin ? 1 : 0, id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    const errorResponse = handleDatabaseError(err);
                    reject(errorResponse);
                    return;
                }

                if (result.affectedRows > 0) {
                    newUser.id = id;
                    resolve({ statusCode: 200, responseMessage: newUser });
                } else {
                    reject({ statusCode: 404, responseMessage: 'User not found.' });
                }
            });

        connection.end();
    });
}

const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("DELETE FROM user WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            if (result.affectedRows > 0) {
                resolve({ statusCode: 200, responseMessage: 'User deleted successfully.' });
            } else {
                reject({ statusCode: 404, responseMessage: 'User not found.' });
            }
        });

        connection.end();
    });
}

const loginUser = ({ username, password }) => {
    return new Promise(async (resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("SELECT * FROM user WHERE username = ?", [username], async (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 400, responseMessage: err });
                return;
            }

            const user = result[0];

            if (!user) {
                reject({ statusCode: 404, responseMessage: 'User not found.' });
                return;
            }

            try {
                const isPasswordMatch = await bcrypt.compare(password, user.password);

                if (!isPasswordMatch) {
                    reject({ statusCode: 401, responseMessage: 'Incorrect password.' });
                    return;
                }

                const response = getJWT(user);
                resolve({ statusCode: 200, responseMessage: response });
            } catch (error) {
                console.error(error);
                reject({ statusCode: 500, responseMessage: 'Something went wrong.' });
            } finally {
                connection.end();
            }
        });
    });
};

const signupUser = ({ username, email, password, repeatPassword, firstName, lastName }) => {
    return new Promise(async (resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        if (password.length < 4) {
            reject({ statusCode: 422, responseMessage: 'Password is too small.' });
            return;
        }

        if (password.length > 30) {
            reject({ statusCode: 422, responseMessage: 'Password is too big.' });
            return;
        }

        if (password !== repeatPassword) {
            reject({ statusCode: 422, responseMessage: 'Passwords must be equal.' });
            return;
        }

        try {
            const user = new User({
                username: username,
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            });

            const addedUser = (await addUser(user)).responseMessage;

            const response = getJWT(addedUser);
            resolve({ statusCode: 200, responseMessage: response });
        } catch (error) {
            console.error(error);
            reject({ statusCode: error.statusCode, responseMessage: error.responseMessage });
        } finally {
            connection.end();
        }
    });
};

const userIsLoggedIn = (userId, isAdmin) => {
    return new Promise((resolve, reject) => {
        if (userId == null) {
            return reject({ statusCode: 401, responseMessage: { auth: false } });
        }

        resolve({ statusCode: 200, responseMessage: { auth: true, id: userId, isAdmin: isAdmin } });
    });
}

const getFavorites = (queryOptions = null, id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        const view = queryOptions?.isPartial
            ? queryOptions?.isNamed
                ? 'partial_named_search_recipes'
                : 'partial_search_recipes'
            : 'search_recipes';

        var query = `SELECT * FROM ${view} sr JOIN favorite_recipe fr ON fr.recipe_id = sr.id 
                        WHERE user_id = ? ORDER BY timestamp_created DESC`;

        const queryValues = [id];
        if (queryOptions.maxResults) {
            queryValues.push(queryOptions.maxResults);
            query += " LIMIT ?";
        }

        connection.query(query, queryValues, (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            resolve({ statusCode: 200, responseMessage: result });
        });

        connection.end();
    })
}

const addFavorite = (id, recipe) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("INSERT INTO favorite_recipe (user_id, recipe_id) VALUES (?, ?)", [id, recipe], (err, result) => {
            if (err) {
                console.error(err);
                if (err.sqlMessage.startsWith('Duplicate entry')) {
                    return reject({ statusCode: 422, responseMessage: 'That recipe is already a favorite.' });
                }
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            resolve({ statusCode: 201, responseMessage: 'Recipe favorited successfully.' });
        });

        connection.end();
    })
}

const removeFavorite = (id, recipe) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("DELETE FROM favorite_recipe WHERE user_id = ? AND recipe_id = ?", [id, recipe], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            if (result.affectedRows > 0) {
                resolve({ statusCode: 200, responseMessage: 'Recipe unfavorited.' });
            } else {
                reject({ statusCode: 404, responseMessage: 'Recipe was not a favorite.' });
            }
        });

        connection.end();
    })
}

const changePassword = (id, { oldPassword, newPassword, repeatNewPassword }) => {
    return new Promise(async (resolve, reject) => {
        const user = new User((await getUser(id)).responseMessage);

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            reject({ statusCode: 401, responseMessage: 'Incorrect password.' });
            return;
        }

        if (newPassword != repeatNewPassword) {
            reject({ statusCode: 422, responseMessage: 'Password and repeat password must be the equals.' });
            return;
        }

        if (oldPassword == newPassword) {
            reject({ statusCode: 422, responseMessage: 'New password can\'t be old password.' });
            return;
        }

        if (newPassword.length < 4) {
            reject({ statusCode: 422, responseMessage: 'Password is too small.' });
            return;
        }

        if (newPassword.length > 30) {
            reject({ statusCode: 422, responseMessage: 'Password is too big.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("UPDATE user SET password = ? WHERE id = ?", [hashedPassword, id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            resolve({ statusCode: 200, responseMessage: 'Password changed successfully.' });
        });

        connection.end();
    })
}

const getRecipeLists = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query(`SELECT id, name FROM recipe_list WHERE user_id = ?`, [id], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            resolve({ statusCode: 200, responseMessage: result });
        });

        connection.end();
    })
};

const createRecipeList = (id, { name }) => {
    return new Promise((resolve, reject) => {
        if (!name) {
            reject({ statusCode: 400, responseMessage: "Invalid body." });
        }
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("INSERT INTO recipe_list (`name`, user_id) VALUES (?, ?)", [name, id], (err, result) => {
            if (err) {
                console.error(err);
                const errorResponse = handleDatabaseError(err);
                reject(errorResponse);
                return;
            }

            resolve({ statusCode: 201, responseMessage: `${name} created successfully.` });
        });

        connection.end();
    })
};

const updateRecipeList = (listId, { name }, userId) => {
    return new Promise(async (resolve, reject) => {
        const recipesLists = (await getRecipeLists(userId)).responseMessage;
        const foundList = recipesLists.find(r => r.id == listId);

        if (!foundList) {
            return reject({ statusCode: 401, responseMessage: "That recipe list isn't yours." });
        }

        if (!name) {
            reject({ statusCode: 400, responseMessage: "Invalid body." });
        }
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("UPDATE recipe_list SET `name` = ? WHERE id = ? ", [name, listId], (err, result) => {
            if (err) {
                console.error(err);
                const errorResponse = handleDatabaseError(err);
                reject(errorResponse);
                return;
            }

            resolve({ statusCode: 200, responseMessage: `${name} updated successfully.` });
        });

        connection.end();
    })
};

const deleteRecipeList = (listId, userId) => {
    return new Promise(async (resolve, reject) => {
        const recipesLists = (await getRecipeLists(userId)).responseMessage;
        const foundList = recipesLists.find(r => r.id == listId);

        if (!foundList) {
            return reject({ statusCode: 401, responseMessage: "That recipe list isn't yours." });
        }
        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("DELETE FROM recipe_list WHERE id = ?", [listId], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            if (result.affectedRows > 0) {
                resolve({ statusCode: 200, responseMessage: 'Recipe list deleted.' });
            } else {
                reject({ statusCode: 404, responseMessage: 'List not found.' });
            }
        });

        connection.end();
    })
};

const getRecipesInList = (queryOptions, listId, userId) => {
    return new Promise(async (resolve, reject) => {
        const recipesLists = (await getRecipeLists(userId)).responseMessage;
        const foundList = recipesLists.find(r => r.id == listId);

        if (!foundList) {
            return reject({ statusCode: 401, responseMessage: "That recipe list isn't yours." });
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();
        const view = queryOptions?.isPartial
            ? queryOptions?.isNamed
                ? 'partial_named_search_recipes'
                : 'partial_search_recipes'
            : 'search_recipes';

        var query = `SELECT sr.* from ${view} sr 
                    JOIN recipe_list_item rli ON rli.recipe_id = sr.id 
                    JOIN recipe_list rl ON rl.id = rli.list_id 
                    WHERE rl.id = ? AND rl.user_id = ?`;

        const queryValues = [listId, userId];
        if (queryOptions.maxResults) {
            queryValues.push(queryOptions.maxResults);
            query += " LIMIT ?";
        }

        connection.query(query, queryValues, (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            resolve({ statusCode: 200, responseMessage: result });
        });

        connection.end();
    })
};

const addRecipeToList = (userId, listId, recipeId) => {
    return new Promise(async (resolve, reject) => {
        const recipesLists = (await getRecipeLists(userId)).responseMessage;
        const foundList = recipesLists.find(r => r.id == listId);

        if (!foundList) {
            return reject({ statusCode: 401, responseMessage: "That recipe list isn't yours." });
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("INSERT INTO recipe_list_item (list_id, recipe_id) VALUES (?, ?)", [listId, recipeId], (err, result) => {
            if (err) {
                console.error(err);

                if (err.sqlMessage.startsWith('Duplicate entry')) {
                    reject(({ statusCode: 422, responseMessage: `Recipe already in list.` }));
                }

                const errorResponse = handleDatabaseError(err);
                reject(errorResponse);
                return;
            }

            resolve({ statusCode: 201, responseMessage: `Recipe added successfully.` });
        });

        connection.end();
    })
};

const deleteRecipeFromList = (userId, listId, recipeId) => {
    return new Promise(async (resolve, reject) => {
        const recipesLists = (await getRecipeLists(userId)).responseMessage;
        const foundList = recipesLists.find(r => r.id == listId);

        if (!foundList) {
            return reject({ statusCode: 401, responseMessage: "That recipe list isn't yours." });
        }

        const connection = mysql.createConnection(connectionOptions);
        connection.connect();

        connection.query("DELETE FROM recipe_list_item WHERE list_id = ? AND recipe_id = ?", [listId, recipeId], (err, result) => {
            if (err) {
                console.error(err);
                reject({ statusCode: 500, responseMessage: err });
                return;
            }

            if (result.affectedRows > 0) {
                resolve({ statusCode: 200, responseMessage: 'Recipe removed successfully.' });
            } else {
                reject({ statusCode: 404, responseMessage: 'Recipe not found in that list.' });
            }
        });

        connection.end();
    })
};

module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.addUser = addUser;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;
module.exports.loginUser = loginUser;
module.exports.signupUser = signupUser;
module.exports.userIsLoggedIn = userIsLoggedIn;
module.exports.getFavorites = getFavorites;
module.exports.addFavorite = addFavorite;
module.exports.removeFavorite = removeFavorite;
module.exports.changePassword = changePassword;
module.exports.getRecipeLists = getRecipeLists;
module.exports.createRecipeList = createRecipeList;
module.exports.updateRecipeList = updateRecipeList;
module.exports.deleteRecipeList = deleteRecipeList;
module.exports.getRecipesInList = getRecipesInList;
module.exports.addRecipeToList = addRecipeToList;
module.exports.deleteRecipeFromList = deleteRecipeFromList;
