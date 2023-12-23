/**
 * Represents a Area entity for interacting with the API.
 *
 * @class
 */
class Area {
    /**
     * Creates an instance of Area.
     *
     * @constructor
     * @param {Object} areaData - The data of a area in the provider's API.
     * @param {string} area.id - The id of a area in the provider's API.
     * @param {string} area.name - The name of a area.
     */
    constructor(areaData) {
        this.id = areaData.id;
        this.name = areaData.name;
    }
}

module.exports = Area;
