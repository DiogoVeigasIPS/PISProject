/**
 * Filename: userController.js
 * Purpose: Aggregates all controllers for the User entity.
 */
const { userActions } = require('../actions')

const readUsers = (req, res) => {
    userActions.getUsers()
        .then(({ code, msg }) => {
            res.status(code).send(msg);
        })
        .catch(({ code, msg }) => {
            res.status(code).send(msg);
        });
}

const readUser = (req, res) => {
    const id = req.params.id;

    userActions.getUser(id)
        .then(({ code, msg }) => {
            res.status(code).send(msg);
        })
        .catch(({ code, msg }) => {
            res.status(code).send(msg);
        });
}

const addUser = (req, res) => {
    userActions.addUser(req.body)
        .then(({ code, msg }) => {
            res.status(code).send(msg);
        })
        .catch(({ code, msg }) => {
            res.status(code).send(msg);
        });
}

const editUser = (req, res) => {
    const id = req.params.id;

    userActions.editUser(id, req.body)
        .then(({ code, msg }) => {
            res.status(code).send(msg);
        })
        .catch(({ code, msg }) => {
            res.status(code).send(msg);
        });
}

const deleteUser = (req, res) => {
    const id = req.params.id;

    userActions.deleteUser(id)
        .then(({ code, msg }) => {
            res.status(code).send(msg);
        })
        .catch(({ code, msg }) => {
            res.status(code).send(msg);
        });
}

module.exports.readUsers = readUsers;
module.exports.readUser = readUser;
module.exports.addUser = addUser;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;