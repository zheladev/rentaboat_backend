import CreatePortDTO from "../dtos/createPort";
import Port from "../entities/port";
import BaseService from "./baseService";

class PortService extends BaseService<Port> {
    constructor() {
        super(Port);
    }

    public async create(portData: CreatePortDTO) {

        const createdPort = await this.repository.create({
            ...portData
        });
        await this.repository.save(createdPort);

        return this.repository.findOne(createdPort.id);
    }
}

export default PortService;