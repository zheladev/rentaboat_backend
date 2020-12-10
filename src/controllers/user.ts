import { NextFunction, Request, Response, Router } from "express";
import User from "../entities/user";
import Controller from "../interfaces/controller";
import { authMiddleware, checkRole } from "../middleware/auth";
import validateUUID from "../middleware/validation";
import UserService from "../services/user";

class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllUsers);
        this.router.get(`${this.path}/:id`, validateUUID, this.getUserById);
        this.router.all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, validateUUID, this.modifyUser)
            .delete(`${this.path}/:id`, validateUUID, this.deleteUser);
    }

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