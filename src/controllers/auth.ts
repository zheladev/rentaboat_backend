import { NextFunction, Router, Request, Response } from "express";
import RegisterDto from "../dtos/register";
import Controller from "../interfaces/controller";
import AuthenticationService from "../services/auth";


class AuthenticationController implements Controller {
    public path = "/auth"
    public router = Router();
    private authService = new AuthenticationService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.logIn);
        this.router.post(this.path, this.register);
    }

    private logIn = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const token = this.authService.logIn(request.body);
            //TODO: send jwt cookie
        } catch(error) {
            next(error);
        }
    }

    private register = async (request: Request, response: Response, next: NextFunction) => {
        const newUserData: RegisterDto = request.body;
        try {
            const newUser = await this.authService.register(newUserData);
            response.send(newUser);
        } catch(error) {
            next(error);
        }
    }
}

export default AuthenticationController;