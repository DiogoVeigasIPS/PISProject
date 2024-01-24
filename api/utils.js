/**
 * Filename: utils.js
 * Purpose: Hosts some functions that are used in multiple places.
 */
const objectIsValid = (obj) => {
    for (const prop in obj) {
        if (obj[prop] === undefined) {
            console.log(prop);
            return false;
        }
    }

    return true;
}

const handlePromise = (promise, res) => {
    promise
        .then(({ statusCode, responseMessage }) => {
            res.status(statusCode).send(responseMessage);
        })
        .catch(({ statusCode, responseMessage }) => {
            console.error({ statusCode, responseMessage })
            res.status(statusCode).send(responseMessage);
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

function handleDatabaseError(err) {
    if (err.sqlMessage.startsWith('Duplicate entry')) {
        const match = err.sqlMessage.match(/for key '.*?\.(\w+)'/);
        const columnName = match ? match[1] : 'column';
        return { statusCode: 422, responseMessage: `${capitalizeWords(columnName)} is duplicate.` };
    } else if (err.sqlMessage.startsWith('Data too long for column')) {
        const problem = err.sqlMessage.split("'")[1];
        return { statusCode: 422, responseMessage: `${capitalizeWords(problem)} is too long.` };
    } else if (err.sqlMessage.startsWith('Cannot add or update a child row: a foreign key constraint fails')) {
        const referencedTable = err.sqlMessage.split('REFERENCES `')[1].split('`')[0];
        return { statusCode: 422, responseMessage: `The ${referencedTable} provided does not exist.` };
    }

    // Default case for generic errors
    return { statusCode: 500, responseMessage: 'Internal Server Error. Please try again later.' };
}

module.exports.handlePromise = handlePromise;
module.exports.objectIsValid = objectIsValid;
module.exports.capitalizeWords = capitalizeWords;
module.exports.shuffleArray = shuffleArray;
module.exports.handleDatabaseError = handleDatabaseError;