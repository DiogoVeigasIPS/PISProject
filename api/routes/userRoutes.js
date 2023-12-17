/**
 * Filename: userRoutes.js
 * Purpose: Implements all routes of the user entity.
 */
const express = require('express');

const { User } = require('../models');
const users = require('../temporaryData');

const router = express.Router();

router.get('', (req, res) => {
    res.status(200).send(users);
});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    const user = users.find(u => u.id == id);
    
    if(user != null) res.status(201).send(user);
    else res.status(404).send('User not found.');
});

router.post('', (req, res) => {
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
});

router.put('/:id', (req, res) => {
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
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const userIndex = users.findIndex(u => u.id == id);

    if(userIndex == -1) {
        res.status(404).send('User not found.');
        return;
    }

    users.splice(userIndex, 1);

    res.status(200).send('User deleted successfully');
})


module.exports = router;