import { getRepository, Repository } from "typeorm";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";


class BaseService<T> {
    protected repository: Repository<T>;
    private dataObjectClass: { new(): T };
    constructor(entityClass : { new(): T }) {
        this.repository = getRepository(entityClass);
    }

    public async getAll() {
        return await this.repository.find();
    }

    public async getById(id: string) {
        const entity = await this.repository.findOne(id);
        if (!entity) {
            throw new EntityNotFoundException<T>();
        }
        return entity;
    }

    public async update(id, data) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<T>();
        }
        await this.repository.update(id, data);
        return this.repository.findOne(id);
    }

    //deletes from database
    //TODO: deletion without losing data for record keeping
    public async delete(id) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<T>();
        }
        await this.repository.delete(id);
    }
}

export default BaseService;