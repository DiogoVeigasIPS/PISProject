const jwt = require('jsonwebtoken');
let dotenv = require('dotenv').config()

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    
    jwt.verify(token, dotenv.parsed.SECRET_WORD, function (err, decoded) {
        if(err){
           console.error(err); 
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