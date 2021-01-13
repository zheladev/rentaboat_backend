import BoatType from "../entities/types/boatType";
import BaseService from "./baseService";

/**
 * BoatType service
 *
 * @class BoatTypeService
 * @extends {BaseService<BoatType>}
 */
class BoatTypeService extends BaseService<BoatType> {
    constructor() {
        super(BoatType);
    }

    /**
     * Creates BoatType with given data
     *
     * @param {Partial<BoatType>} boatTypeData
     * @return {*} 
     * @memberof BoatTypeService
     */
    public async create(boatTypeData: Partial<BoatType>) {

        const createdBoatType = await this.repository.create({
            ...boatTypeData
        });
        await this.repository.save(createdBoatType);

        return await this.repository.findOne(createdBoatType.id);
    }

}

export default BoatTypeService;