import { getRepository } from "typeorm";
import LoginDto from "../dtos/login";
import RegisterDto from "../dtos/register";
import UserType from "../entities/types/userType";
import User from "../entities/user";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import MissingParametersException from "../exceptions/MissingParametersException";
import WrongPasswordException from "../exceptions/WrongPasswordException";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import TokenData from "../interfaces/tokenData";
import UserService from "./user";
import * as jwt from 'jsonwebtoken';
import HttpException from "../exceptions/HttpException";
import EmailAlreadyInUseException from "../exceptions/EmailAlreadyInUseException";


class AuthenticationService extends UserService {
    private userTypeRepository = getRepository(UserType);

    public async logIn( {username, password}: LoginDto): Promise<{token: TokenData, user: User}> {
        const user = await this.validateLoginData(username, password);
        const tokenData = this.createToken(user);
        return {
            token: tokenData,
            user
        }
    }

    public async register(userData: RegisterDto): Promise<{token: TokenData, user: User}> {
        try {
            const userType = await this.userTypeRepository.findOne({ name: userData.userType });
            await this.validateRegistrationData(userData, userType);

            const createdUser = await this.repository.create({
                ...userData,
                userType: userType
            });
            await this.repository.save(createdUser);
            const tokenData = this.createToken(createdUser);
            return {
                token: tokenData,
                user: createdUser,
            }
        } catch (error) {
            //TODO
            throw error;
        }
    }

    private async validateLoginData(username: string, password: string) {
        if(!(username && password)) {
            throw new MissingParametersException();
        }

        //TODO: Sanitize!!!!!
        const user = await this.repository
            .createQueryBuilder('user')
            .addSelect("user.password")
            .where('user.username = :username', {
                username: username
            })
            .leftJoinAndSelect("user.userType", "userType")
            .getOne();
        if(!user) {
            throw new EntityNotFoundException<User>(User);
        }

        if(! await user.isValidPassword(password)) {
            throw new WrongPasswordException();
        }

        user.password = undefined;
        return user;
    }

    private async validateRegistrationData(userData: RegisterDto, userType: UserType) {       
        if (!userType || !userType.isRegistrable) {
            throw new ForbiddenActionException("Register non registrable user.");
        }

        //TODO: create username already in use exception
        if (await this.repository.findOne({ username: userData.username})) {
            throw new HttpException(400, "Username already in use");
        }

        if (await this.repository.findOne({ email: userData.email})) {
            throw new EmailAlreadyInUseException(userData.email);
        }
    }

    private createToken(user: User): TokenData {
        const expiresIn = 60 * 60 * 24; // 1 day
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
          id: user.id,
          //TODO: store auth level
        };
        return {
          expiresIn,
          token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
      }
    
}

export default AuthenticationService;