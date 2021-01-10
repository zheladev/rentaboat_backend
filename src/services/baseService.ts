import { getRepository, Repository } from "typeorm";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";


class BaseService<T> {
    protected repository: Repository<T>;
    private dataObjectClass: { new(): T };
    constructor(entityClass : { new(): T }) {
        this.repository = getRepository(entityClass);
    }

    public async getAll(skip: number = 0, take: number = 40) {
        return await this.repository.find({ skip: skip, take: take});
    }

    public async getById(id: string) {
        const entity = await this.repository.findOne(id);
        if (!entity) {
            throw new EntityNotFoundException<T>(this.dataObjectClass);
        }
        return entity;
    }

    public async update(id, entityData: Partial<T>) {
        const entity = await this.repository.findOne(id);
        if (!entity) {
            throw new EntityNotFoundException<T>(this.dataObjectClass);
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
            throw new EntityNotFoundException<T>(this.dataObjectClass);
        }
        await this.repository.delete(id);
    }
}

export default BaseService;