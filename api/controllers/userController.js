/**
 * Filename: userController.js
 * Purpose: Aggregates all controllers for the User entity.
 */
const { User } = require('../models');
const users = require('../temporaryData');

// Create User - functionalities that can work for the router and mustache routing

const readUsers = (req, res) => {
    res.status(200).send(users);
}

const readUser = (req, res) => {
    const id = req.params.id;

    const user = users.find(u => u.id == id);

    if (user != null) res.status(201).send(user);
    else res.status(404).send('User not found.');
}

const addUser = (req, res) => {
    const user = new User(
        {
            id: users.at(-1).id + 1,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
    )
    
    // When inserting in the database, check any problem here
    users.push(user);

    res.status(201).send(user);
}

const editUser = (req, res) => {
    const id = req.params.id;

    const user = new User(
        {
            id: id,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
    )
    
    const oldUser = users.find(u => u.id == id);

    if(oldUser == null) {
        res.status(404).send('User not found.');
        return;
    }

    for(prop in user){
        oldUser[prop] = user[prop];
    }

    res.status(200).send(user);
}

const deleteUser = (req, res) => {
    const id = req.params.id;

    const userIndex = users.findIndex(u => u.id == id);

    if(userIndex == -1) {
        res.status(404).send('User not found.');
        return;
    }

    users.splice(userIndex, 1);

    res.status(200).send('User deleted successfully');
}

module.exports.readUsers = readUsers;
module.exports.readUser = readUser;
module.exports.addUser = addUser;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;