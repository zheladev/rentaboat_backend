import { NextFunction, Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { isExpressionStatement } from "typescript";
import CreateUserDto from "../dtos/user";
import User from "../entities/user";
import Controller from "../interfaces/controller";
import HttpException from "../exceptions/HttpException";


//TODO: decouple view logic from business logic
class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private userRepository = getRepository(User);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllUsers);
        this.router.post(this.path, this.createUser);
        //TODO: implement and add all other endpoints
    }

    private getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
        const users = await this.userRepository.find(); //todo: remove unwanted parameters
        response.send(users);
    };

    private getUserById = async (request: Request, response: Response, next: NextFunction) => {
        
    };

    private createUser = async (request: Request, response: Response, next: NextFunction) => {
        const newUserData: CreateUserDto = request.body;
        try {
            const hashedPassword = await bcrypt.hash(newUserData.password, 10);
            const newUser = this.userRepository.create({
                ...newUserData,
                password: hashedPassword,
            })
            await this.userRepository.save(newUser);
            response.send(newUser);
        } catch(error) {
            next(new HttpException(400, error.message)); //TODO: do it properly you retard
        }
    };

    private modifyUser = async (request: Request, response: Response, next: NextFunction) => {
        
    };

    private deleteUser = async (request: Request, response: Response, next: NextFunction) => {
        
    };

}

export default UserController;