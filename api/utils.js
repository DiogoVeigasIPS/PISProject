/**
 * Filename: utils.js
 * Purpose: Hosts some functions that are used in multiple places.
 */
const objectIsValid = (obj) => {
    for (const prop in obj) {
        if (obj[prop] === undefined)
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

function capitalizeWords(inputString) {
    const words = inputString.split(' ');

    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    const resultString = capitalizedWords.join(' ');

    return resultString;
}

module.exports.handlePromise = handlePromise;
module.exports.objectIsValid = objectIsValid;
module.exports.capitalizeWords = capitalizeWords;