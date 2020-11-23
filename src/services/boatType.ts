import BoatType from "../entities/types/boatType";
import BaseService from "./baseService";

class BoatTypeService extends BaseService<BoatType> {
    constructor() {
        super(BoatType);
    }

    public async create(boatTypeData: Partial<BoatType>) {

        const createdBoatType = await this.repository.create({
            ...boatTypeData
        });
        await this.repository.save(createdBoatType);

        return await this.repository.findOne(createdBoatType.id);
    }

}

export default BoatTypeService;