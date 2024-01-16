const jwt = require('jsonwebtoken');
let dotenv = require('dotenv').config()

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'] || req.query.token;
    
    if (!token)
        return res.redirect('/auth');

    jwt.verify(token, dotenv.parsed.SECRET_WORD, function (err, decoded) {
        if (err)
            return res.redirect('/auth');

        //console.log(decoded)
        req.userId = decoded.id;
        next();
    });
}

module.exports.verifyJWT = verifyJWT;