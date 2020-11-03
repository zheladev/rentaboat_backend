import { getRepository } from "typeorm";
import CreateUserDto from "../dtos/user";
import UserType from "../entities/types/userType";
import User from "../entities/user";
import * as bcrypt from 'bcrypt';
import EmailAlreadyInUseException from "../exceptions/EmailAlreadyInUseException";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import BaseService from "./baseService";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";

const SALT_ROUNDS = 10;

class UserService extends BaseService<User> {
    private userTypeRepository = getRepository(UserType);

    constructor() {
        super(User);
    }

    public async delete(id: string) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<User>();
        }
        await this.repository.update(id, { isDeleted: true });
    }

    //TODO: create update DTO
    public async update(id: string, data: User) {
        if (!await this.repository.findOne(id)) {
            throw new EntityNotFoundException<User>();
        }
        //TODO: findOne and return User or UpdateResult?
        await this.repository.update(id, data);
        return await this.repository.findOne(id);
    }

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
            const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
            const createdUser = await this.repository.create({
                ...userData,
                userType: userType,
                password: hashedPassword
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

export default UserService;