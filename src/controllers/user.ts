import { NextFunction, Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { isExpressionStatement } from "typescript";
import CreateUserDto from "../dtos/user";
import User from "../entities/user";
import Controller from "../interfaces/controller";
import HttpException from "../exceptions/HttpException";
import UserService from "../services/user";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";


//TODO: decouple view logic from business logic
class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllUsers);
        this.router.get(`${this.path}/:id`, this.getUserById);
        this.router.patch(`${this.path}/:id`, this.modifyUser);
        this.router.delete(`${this.path}/:id`, this.deleteUser);
        //this.router.post(this.path, this.createUser);
       
    }

    //TODO: endpoint to query by custom params

    private getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getAll();
            response.send(users);
        } catch(error) {
            next(error);
        }
    };

    private getUserById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const user = await this.userService.getById(id);
            response.send(user);
        } catch(error) {
            next(error);
        }
    };

    // private createUser = async (request: Request, response: Response, next: NextFunction) => {
    //     const newUserData: CreateUserDto = request.body;
    //     try {
    //         const newUser = await this.userService.register(newUserData);
    //         response.send(newUser);
    //     } catch(error) {
    //         next(error);
    //     }
    // };

    private modifyUser = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const userData: User = request.body;
        try {
            const updatedUser = await this.userService.update(id, userData);
            response.send(updatedUser);
        } catch(error) {
            next(error);
        }
    };

    private deleteUser = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        try {
            const deletedUser = await this.userService.delete(id);
            response.send(deletedUser);
        } catch(error) {
            next(error);
        }
    };

}

export default UserController;