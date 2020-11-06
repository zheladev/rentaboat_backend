import Boat from "../entities/boat";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import BaseService from "./baseService";


class BoatService extends BaseService<Boat> {
    constructor() {
        super(Boat);
    }


    public async delete(id: string) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<Boat>();
        }
        await this.repository.update(id, { isDeleted: true });
    }
}

export default BoatService;