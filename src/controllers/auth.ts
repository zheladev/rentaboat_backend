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
        this.router.post(`${this.path}/login`, this.logIn);
        this.router.post(`${this.path}/register`, this.register);
    }

    private logIn = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const {token, user} = await this.authService.logIn(request.body);
            response.setHeader('X-Access-Token', token.token);
            response.send(user);
        } catch(error) {
            next(error);
        }
    }

    private register = async (request: Request, response: Response, next: NextFunction) => {
        const newUserData: RegisterDto = request.body;
        try {
            const {token, user} = await this.authService.register(newUserData);
            response.setHeader('X-Access-Token', token.token);
            response.send(user);
        } catch(error) {
            next(error);
        }
    }
}

export default AuthenticationController;