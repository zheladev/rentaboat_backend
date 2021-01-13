import CreateShipyardDTO from "../dtos/createShipyard";
import Shipyard from "../entities/shipyard";
import BaseService from "./baseService";

/**
 * Shipyard service
 *
 * @category Services
 * @class ShipyardService
 * @extends {BaseService<Shipyard>}
 */
class ShipyardService extends BaseService<Shipyard> {
    constructor() {
        super(Shipyard);
    }

    /**
     * Creates and returns Shipyard with given data
     *
     * @param {CreateShipyardDTO} shipyardData
     * @return {*} 
     * @memberof ShipyardService
     */
    public async create(shipyardData: CreateShipyardDTO) {

        const createdShipyard = await this.repository.create({
            ...shipyardData
        });
        await this.repository.save(createdShipyard);

        return this.repository.findOne(createdShipyard.id);
    }
}

export default ShipyardService;