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


/**
 * Authentication service
 *
 * @class AuthenticationService
 * @extends {BaseService<User>}
 */
class AuthenticationService extends BaseService<User> {
    private userTypeRepository = getRepository(UserType);
    private fileRepository = getFileRepository(process.env.USER_IMG_DIR)

    constructor() {
        super(User);
    }

    /**
     *
     *
     * @param {LoginDto} {username, password}
     * @return {*}  {Promise<{token: TokenData, user: User}>}
     * @memberof AuthenticationService
     */
    public async logIn( {username, password}: LoginDto): Promise<{token: TokenData, user: User}> {
        const user = await this.validateLoginData(username, password);
        const tokenData = this.createToken(user);
        return {
            token: tokenData,
            user
        }
    }

    /**
     * Creates User with given data and returns said User and its access token
     *
     * @param {RegisterDto} userData
     * @return {*}  {Promise<{token: TokenData, user: User}>}
     * @memberof AuthenticationService
     */
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

    /**
     * Validates given login data and returns matched User if login is successful
     *
     * @private
     * @param {string} username
     * @param {string} password
     * @return {*} 
     * @memberof AuthenticationService
     */
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

    /**
     * Validates RegisterDto
     *
     * @private
     * @param {RegisterDto} userData
     * @param {UserType} userType
     * @memberof AuthenticationService
     */
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

    /**
     * Returns signed JWT token for given User and expirationTime pair.
     *
     * @private
     * @param {User} user
     * @param {number} [expiresIn=60 * 60 * 24] Time until token expiration
     * @return {*}  {TokenData}
     * @memberof AuthenticationService
     */
    private createToken(user: User, expiresIn: number = 60 * 60 * 24): TokenData {
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