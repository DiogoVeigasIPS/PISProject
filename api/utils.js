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

const capitalizeWords = (inputString) => {
    const words = inputString.split(' ');

    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    const resultString = capitalizedWords.join(' ');

    return resultString;
}

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

module.exports.handlePromise = handlePromise;
module.exports.objectIsValid = objectIsValid;
module.exports.capitalizeWords = capitalizeWords;
module.exports.shuffleArray = shuffleArray;