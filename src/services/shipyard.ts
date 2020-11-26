import CreateShipyardDTO from "../dtos/createShipyard";
import Shipyard from "../entities/shipyard";
import BaseService from "./baseService";

class ShipyardService extends BaseService<Shipyard> {
    constructor() {
        super(Shipyard);
    }

    public async create(shipyardData: CreateShipyardDTO) {

        const createdShipyard = await this.repository.create({
            ...shipyardData
        });
        await this.repository.save(createdShipyard);

        return this.repository.findOne(createdShipyard.id);
    }
}

export default ShipyardService;