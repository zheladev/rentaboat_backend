import { getRepository, Repository } from "typeorm";


class BaseService<T> {
    protected repository: Repository<T>;
    private dataObjectClass: { new(): T };
    constructor() {
        this.repository = getRepository(this.dataObjectClass);
    }

    public async getAll() {
        return await this.repository.find();
    }

    public async getById(id: string) {
        return await this.repository.findOne(id);
    }

    public async update(id, data) {
        return await this.repository.update(id, data);
    }

    //deletes from database
    //TODO: deletion without losing data for record keeping
    public async delete(id) {
        return await this.repository.delete(id);
    }
}

export default BaseService;