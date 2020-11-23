import UserType from "../entities/types/userType";
import BaseService from "./baseService";


class UserTypeService extends BaseService<UserType> {
    constructor() {
        super(UserType);
    }

    public async create(userTypeData: Partial<UserType>) {

        const createdUserType = await this.repository.create({
            ...userTypeData
        });
        await this.repository.save(createdUserType);

        return await this.repository.findOne(createdUserType.id);
    }
}

export default UserTypeService;