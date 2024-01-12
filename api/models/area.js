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
     * @param {Object} areaData - The data representing an area.
     * @param {string} areaData.id - The id of a area.
     * @param {string} areaData.name - The name of a area.
     */
    constructor(areaData, id = areaData.id) {
        this.id = id ?? null;
        this.name = areaData.name;
    }
}

module.exports = Area;
