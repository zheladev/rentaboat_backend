import { getRepository } from "typeorm";
import LoginDto from "../dtos/login";
import RegisterDto from "../dtos/register";
import UserType from "../entities/types/userType";
import User from "../entities/user";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import MissingParametersException from "../exceptions/MissingParametersException";
import WrongPasswordException from "../exceptions/WrongPasswordException";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import TokenData from "../interfaces/tokenData";
import * as jwt from 'jsonwebtoken';
import HttpException from "../exceptions/HttpException";
import EmailAlreadyInUseException from "../exceptions/EmailAlreadyInUseException";
import BaseService from "./baseService";
import { getFileRepository } from "../repository/fileRepository";
import WrongFileTypeException from "../exceptions/WrongFileTypeException";


class AuthenticationService extends BaseService<User> {
    private userTypeRepository = getRepository(UserType);
    private fileRepository = getFileRepository(process.env.USER_IMG_DIR)

    constructor() {
        super(User);
    }

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
            const base64Data = userData.base64Data || undefined;
            delete userData.base64Data;

            if(!this.fileRepository.validFileType(base64Data)) {
                throw new WrongFileTypeException(this.fileRepository.fileType(base64Data));
            }
            
            const userType = await this.userTypeRepository.findOne({ intValue: userData.userType });
            await this.validateRegistrationData(userData, userType);

            const createdUser = await this.repository.create({
                ...userData,
                userType: userType
            });
            await this.repository.save(createdUser);

            const savedUser = await this.repository.findOne(createdUser.id);

            let imgPath = null;

            if (base64Data !== undefined) {
                try {
                    imgPath = this.fileRepository.save(savedUser.id, base64Data);
                } catch (e) {
                    throw e;
                }
                
                if (imgPath !== null) {
                    savedUser.path = imgPath;
                    await this.repository.save(savedUser);
                }
            }

            const tokenData = this.createToken(createdUser);
            return {
                token: tokenData,
                user: savedUser,
            }
        } catch (error) {
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
            throw new WrongPasswordException();
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