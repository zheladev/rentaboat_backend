import UserType from "../entities/types/userType";
import BaseService from "./baseService";


/**
 * UserType Service
 *
 * @class UserTypeService
 * @extends {BaseService<UserType>}
 */
class UserTypeService extends BaseService<UserType> {
    constructor() {
        super(UserType);
    }

    /**
     * Creates a new UserType record in database and returns a mapped object with its params.
     *
     * @param {Partial<UserType>} userTypeData
     * @return {*} 
     * @memberof UserTypeService
     */
    public async create(userTypeData: Partial<UserType>) {

        const createdUserType = await this.repository.create({
            ...userTypeData
        });
        await this.repository.save(createdUserType);

        return await this.repository.findOne(createdUserType.id);
    }
}

export default UserTypeService;