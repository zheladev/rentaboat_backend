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

    public async update(id, entityData: Partial<T>) {
        const entity = await this.repository.findOne(id);
        if (!entity) {
            throw new EntityNotFoundException<T>();
        }

        Object.keys(entityData).forEach(key => {
            entity[key] = entityData[key];
        })
        await this.repository.save(entity);
        //fetch entity again to purge unwanted params from response
        return await this.repository.findOne(id);
    }

    //deletes from database, override if logs needed
    public async delete(id) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<T>();
        }
        await this.repository.delete(id);
    }

    public async create(data: Partial<T>) {
        //TODO
    }
}

export default BaseService;