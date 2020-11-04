import User from "../entities/user";
import BaseService from "./baseService";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";

class UserService extends BaseService<User> {
    constructor() {
        super(User);
    }

    public async delete(id: string) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<User>();
        }
        await this.repository.update(id, { isDeleted: true });
    }
}

export default UserService;