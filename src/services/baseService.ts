import { getRepository, Repository } from "typeorm";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import { IDTO } from "../interfaces/DTO";


/**
 * Abstract BaseService class services should inherit from
 *
 * @category Services
 * @class BaseService
 * @template T
 */
abstract class BaseService<T> {
    protected repository: Repository<T>;
    private dataObjectClass: { new(): T };
    constructor(entityClass : { new(): T }) {
        this.repository = getRepository(entityClass);
    }

    /**
     * Creates entity with given data
     *
     * @param {IDTO} model
     * @return {*}  {Promise<T>}
     * @memberof BaseService
     */
    public async _create(model: IDTO): Promise<T> {
        const e: T = await this.repository.save({
            ...model
        });
        await this.repository.save(e);
        return e;
    }

    /**
     *  Returns array containing entities
     *
     * @param {number} [skip=0]
     * @param {number} [take=40]
     * @return {*}  {Promise<Array<T>>}
     * @memberof BaseService
     */
    public async getAll(skip: number = 0, take: number = null): Promise<Array<T>> {
        return await take ? this.repository.find({ skip: skip, take: take}) : this.repository.find({ skip: skip });
    }

    /**
     * Returns matched entity
     *
     * @param {string} id
     * @return {*} 
     * @memberof BaseService
     */
    public async getById(id: string): Promise<T> {
        const entity = await this.repository.findOne(id);
        if (!entity) {
            throw new EntityNotFoundException<T>(this.dataObjectClass);
        }
        return entity;
    }

    /**
     * Updates matched entity with given data
     *
     * @param {string} id
     * @param {Partial<T>} entityData
     * @return {*}  {Promise<T>}
     * @memberof BaseService
     */
    public async update(id: string, entityData: Partial<T>): Promise<T> {
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

    
    /**
     * Deletes matched entity
     *
     * @param {string} id
     * @memberof BaseService
     */
    public async delete(id: string) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<T>(this.dataObjectClass);
        }
        await this.repository.delete(id);
    }
}

export default BaseService;