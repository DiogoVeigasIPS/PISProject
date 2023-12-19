const objectIsValid = (obj) => {
    for(const prop in obj){
        if(obj[prop] == null)
            return false;
    }

    return true;
}

module.exports.objectIsValid = objectIsValid;