/**
 * Filename: jsonWebToken.js
 * Purpose: Implements the sign and verify methods for json web token.
 */
const jwt = require('jsonwebtoken');
let dotenv = require('dotenv').config()

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    
    if(token == null){
        console.error('Token was null');
        return next();
    } 

    jwt.verify(token, dotenv.parsed.SECRET_WORD, function (err, decoded) {
        if(err){
            console.error('Token wasnt ok');
        }

        //console.log(decoded)
        req.userId = decoded?.id;
        req.isAdmin = decoded?.isAdmin;
        next();
    });
}

const getJWT = (user) => {
    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, dotenv.parsed.SECRET_WORD, {
        expiresIn: 60 * 60
    });

    return { auth: true, token: token, id: user.id, isAdmin: user.isAdmin };
}

module.exports.verifyJWT = verifyJWT;
module.exports.getJWT = getJWT;