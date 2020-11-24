import CreatePortDTO from "../dtos/createPort";
import Port from "../entities/port";
import BaseService from "./baseService";

class PortService extends BaseService<Port> {
    constructor() {
        super(Port);
    }

    public async create(portData: CreatePortDTO) {

        const createdPort = this.repository.create({
            ...portData
        });
        await this.repository.save(createdPort);

        return createdPort;
    }
}

export default PortService;