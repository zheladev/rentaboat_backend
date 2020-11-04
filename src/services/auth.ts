import { getRepository } from "typeorm";
import CreateUserDto from "../dtos/user";
import UserType from "../entities/types/userType";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import BaseService from "./baseService";
import UserService from "./user";


class AuthenticationService extends UserService {
    private userTypeRepository = getRepository(UserType);
    
    public async register(userData: CreateUserDto) {
        //TODO: Right now userTypes are inserted manually into database
        //a script to fill the database or a migration will be necessary in the future.
        const userType = await this.userTypeRepository.findOne({ name: userData.userType });

        if (!userType || !userType.isRegistrable) {
            throw new ForbiddenActionException("Register non registrable user.");
        }

        if (await this.repository.findOne({ username: userData.username})) {
            //TODO: create username already in use exception
        }

        if (await this.repository.findOne({ username: userData.email})) {
            //TODO: create email already in use exception
        }
        //use postgres error codes instead of procedural checking?

        try {
            const createdUser = await this.repository.create({
                ...userData,
                userType: userType
            });
            await this.repository.save(createdUser);
            return createdUser;
        } catch (error) {
            //TODO
            throw error;
        }
    }

    //TODO login: select password as per https://typeorm.io/#/select-query-builder/hidden-columns
}

export default AuthenticationService;