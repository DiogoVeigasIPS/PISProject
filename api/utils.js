const objectIsValid = (obj) => {
    for(const prop in obj){
        if(obj[prop] === undefined)
            return false;
    }

    return true;
}

const handlePromise = (promise, res) => {
    promise
        .then(({ code, msg }) => {
            res.status(code).send(msg);
        })
        .catch(({ code, msg }) => {
            res.status(code).send(msg);
        });
};

module.exports.handlePromise = handlePromise;
module.exports.objectIsValid = objectIsValid;